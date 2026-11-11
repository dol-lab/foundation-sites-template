// Replays a touch drag in Chromium and summarizes the main thread's rendering work per step: restyles, layouts
// and paints, with the reasons Chromium's invalidation tracking gives (what changed, where, from which script line).
// Each step is one touchmove and the frame after it; consecutive steps doing the same work are merged.
// `release` covers the touchend and the frames until finite animations (the sheet sliding to a stop) end.
// Before the touch, finite animations (a modal opening) run out and endless ones (spinners) are paused: they would
// restyle and paint every frame and hide the drag's own work.
const path = require("node:path");

const CATEGORIES = [
  "devtools.timeline",
  "disabled-by-default-devtools.timeline",
  "disabled-by-default-devtools.timeline.invalidationTracking",
];

/**
 * @param {string} name A trace node name: "DIV id='x' class='a b'".
 * @return {string} As a selector: div#x.a.b.
 */
function nodeName(name = "?") {
  const [, tag, rest = ""] = /^(\S+)\s*(.*)$/.exec(name) || [, name];
  const id = /id='([^']*)'/.exec(rest)?.[1];
  const classes = /class='([^']*)'/.exec(rest)?.[1].split(/\s+/).filter(Boolean) || [];
  return (
    (tag.startsWith("#") || tag.startsWith(":") ? tag : tag.toLowerCase()) +
    (id ? "#" + id : "") +
    classes
      .slice(0, 3)
      .map((c) => "." + c)
      .join("")
  );
}

/**
 * @param {object[]} [stack] A trace event's stackTrace.
 * @return {string} " at <file>:<line> <function>" for the innermost frame, or "".
 */
function caller(stack) {
  const top = stack?.[0];
  if (!top) return "";
  const file = path.basename(top.url.split("?")[0]) || top.url;
  return ` at ${file}:${top.lineNumber} ${top.functionName || "(anonymous)"}`.trimEnd();
}

/**
 * @param {Map<string, number>} counts Reasons with how often they occurred.
 * @param {number} [limit] How many to list.
 * @return {string[]} "<reason> ×n", most frequent first.
 */
function list(counts, limit = 8) {
  const sorted = [...counts].sort((a, b) => b[1] - a[1]);
  const out = sorted.slice(0, limit).map(([k, n]) => (n > 1 ? `${k} ×${n}` : k));
  if (sorted.length > limit) out.push(`+${sorted.length - limit} more`);
  return out;
}

/**
 * @param {object[]} events The main thread's trace events of one step.
 * @return {object} Its restyles, layouts and paints with their reasons, and the milliseconds they took.
 */
function summarize(events) {
  const bump = (map, key) => map.set(key, (map.get(key) || 0) + 1);
  const why = { style: new Map(), layout: new Map(), invalidated: new Map() };
  const layouts = new Map();
  const paints = new Map();
  let restyles = 0;
  let elements = 0;
  let ms = 0;
  for (const e of events) {
    const d = e.args?.data || {};
    switch (e.name) {
      case "UpdateLayoutTree":
        restyles++;
        elements += e.args.elementCount || 0;
        ms += (e.dur || 0) / 1000;
        break;
      case "Layout": {
        const { dirtyObjects, totalObjects } = e.args.beginData;
        const roots = (e.args.endData?.layoutRoots || []).map((r) => nodeName(r.nodeName)).join(", ");
        bump(layouts, `${dirtyObjects}/${totalObjects} objects from ${roots || "?"}`);
        ms += (e.dur || 0) / 1000;
        break;
      }
      case "Paint": {
        const [x0, y0, x1, , , y2] = d.clip || [];
        const size = Math.abs(x1 - x0) < 1e6 ? ` ${Math.round(x1 - x0)}×${Math.round(y2 - y0)}` : "";
        bump(paints, nodeName(d.nodeName) + size);
        ms += (e.dur || 0) / 1000;
        break;
      }
      case "StyleRecalcInvalidationTracking":
        bump(why.style, `${d.reason}: ${nodeName(d.nodeName)}${d.subtree ? " (subtree)" : ""}${caller(d.stackTrace)}`);
        break;
      case "LayoutInvalidationTracking":
        bump(why.layout, `${d.reason}: ${nodeName(d.nodeName)}${caller(d.stackTrace)}`);
        break;
      case "ScheduleStyleInvalidationTracking": {
        const changed =
          (d.changedAttribute && `[${d.changedAttribute}]`) ||
          (d.changedClass && `.${d.changedClass}`) ||
          (d.changedId && `#${d.changedId}`) ||
          (d.changedPseudo && `:${d.changedPseudo}`) ||
          "?";
        bump(why.invalidated, `${changed} on ${nodeName(d.nodeName)}${caller(d.stackTrace)}`);
        break;
      }
      case "StyleInvalidatorInvalidationTracking":
        if (d.selectors?.length) {
          const selectors = d.selectors.map((s) => s.selector);
          const shown = selectors.slice(0, 3).join(", ") + (selectors.length > 3 ? `, +${selectors.length - 3}` : "");
          bump(why.invalidated, `${d.reason} ${nodeName(d.nodeName)} by ${shown}`);
        }
        break;
    }
  }
  const out = {
    restyles: restyles ? `${restyles}× ${elements} elements` : 0,
    layouts: list(layouts),
    paints: list(paints),
    why: {
      style: list(why.style),
      layout: list(why.layout),
      invalidated: list(why.invalidated),
    },
  };
  for (const key of Object.keys(out.why)) if (!out.why[key].length) delete out.why[key];
  if (!Object.keys(out.why).length) delete out.why;
  return { ...out, ms: +ms.toFixed(1) };
}

/**
 * @param {object}   browser Playwright Chromium browser.
 * @param {object}   page    The page, opened with hasTouch.
 * @param {object}   start   Viewport point the finger lands on: { x, y }.
 * @param {number[]} drag    [dx, dy] the finger moves in total.
 * @param {number}   steps   Touchmoves to get there.
 * @return {Promise<{pausedAnimations: number, steps: object[]}>} How many endless animations were paused, and per
 *   step (merged where equal) and for the release: the summary of `summarize()`.
 */
async function traceDrag(browser, page, start, drag, steps) {
  const cdp = await page.context().newCDPSession(page);
  const touch = (type, point) =>
    cdp.send("Input.dispatchTouchEvent", { type, touchPoints: point ? [{ x: point.x, y: point.y }] : [] });
  // console.timeStamp() marks the start of each step in the trace, on the page's main thread.
  const mark = (label) => page.evaluate((l) => console.timeStamp(l), label);
  const frame = () => page.evaluate(() => new Promise((resolve) => requestAnimationFrame(resolve)));
  const at = (i) => ({ x: start.x + (drag[0] * i) / steps, y: start.y + (drag[1] * i) / steps });
  const settle = () =>
    page.evaluate(() => {
      const finite = document.getAnimations().filter((a) => Number.isFinite(a.effect?.getComputedTiming().endTime));
      const done = Promise.all(finite.map((a) => a.finished.catch(() => {})));
      return Promise.race([done, new Promise((resolve) => setTimeout(resolve, 2000))]);
    });

  await settle();
  const paused = await page.evaluate(() => {
    const running = document.getAnimations().filter((a) => a.playState === "running");
    running.forEach((a) => a.pause());
    return running.length;
  });
  await frame();
  await browser.startTracing(page, { categories: CATEGORIES });
  await mark("probe:0");
  await touch("touchStart", start);
  await frame();
  for (let i = 1; i <= steps; i++) {
    await mark(`probe:${i}`);
    await touch("touchMove", at(i));
    await frame();
  }
  await mark(`probe:${steps + 1}`);
  await touch("touchEnd");
  await settle();
  await frame();
  await mark("probe:end");
  const { traceEvents } = JSON.parse(await browser.stopTracing());

  const marks = traceEvents.filter((e) => e.name === "TimeStamp" && e.args?.data?.message?.startsWith("probe:"));
  const { pid, tid } = marks[0];
  const main = traceEvents.filter((e) => e.pid === pid && e.tid === tid).sort((a, b) => a.ts - b.ts);
  const buckets = marks.slice(0, -1).map((m, i) => main.filter((e) => e.ts >= m.ts && e.ts < marks[i + 1].ts));

  const results = [];
  let lastWork;
  for (const [i, events] of buckets.entries()) {
    const { ms, ...work } = summarize(events);
    const key = JSON.stringify(work);
    const point = i && i <= steps ? at(i) : null;
    const finger = point && `${Math.round(point.x)},${Math.round(point.y)}`;
    const last = results.at(-1);
    if (point && last?.finger && key === lastWork) {
      last.step = `${last.step.split("-")[0]}-${i}`;
      last.finger = `${last.finger.split(" ")[0]} → ${finger}`;
      last.ms = Math.max(last.ms, ms);
      continue;
    }
    lastWork = key;
    results.push({ step: point ? String(i) : i ? "release" : "touchstart", ...(point && { finger }), ...work, ms });
  }
  return { pausedAnimations: paused, steps: results };
}

module.exports = { traceDrag };
