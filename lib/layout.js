// A shot's elements as text (box, non-default computed style, classes, text), so two runs
// can be compared without looking at pixels. Used by shots.js.

const MAX_LINES = 12;

/**
 * Runs in the page: records every visible element under root that meets the clip.
 * Style holds only the values that differ from the same tag's default (a blank iframe).
 *
 * @param {Element} root The shot's element (documentElement for a viewport shot).
 * @param {object|null} clip {x, y, w, h} in viewport pixels, null for root's box.
 * @return {object} key → { r: [x, y, w, h], s: { property: value } }, relative to the clip.
 */
function snapshotInPage(root, clip) {
  // Derived values: sizes and offsets are in the box, logical properties mirror physical ones.
  const SKIP =
    /^(width|height|top|right|bottom|left|transform-origin|perspective-origin|-webkit-text-(fill|stroke)-color)$|-(block|inline)(-|$)|^inset-|^(inline|block)-size$/;
  const frame = document.createElement("iframe");
  frame.style.cssText = "position:absolute;width:0;height:0;border:0;visibility:hidden";
  document.body.append(frame);
  const blank = frame.contentDocument;
  const defaults = {};
  const defaultsOf = (tag) => {
    if (!defaults[tag]) {
      const el = blank.body.appendChild(blank.createElement(tag));
      defaults[tag] = Object.fromEntries([...getComputedStyle(el)].map((p) => [p, getComputedStyle(el)[p]]));
      el.remove();
    }
    return defaults[tag];
  };
  const box = root.getBoundingClientRect();
  const c = clip || { x: box.x, y: box.y, w: box.width, h: box.height };
  const round = (n) => Math.round(n * 10) / 10;
  const out = {};

  const record = (key, style, tag, extra) => {
    const base = defaultsOf(tag);
    const s = {};
    for (const p of style) {
      if (!SKIP.test(p) && style[p] !== base[p]) s[p] = style[p];
    }
    out[key] = { ...out[key], s: { ...s, ...extra } };
  };

  const walk = (el, prefix) => {
    const seen = {};
    for (const child of el.children) {
      if (/^(SCRIPT|STYLE|TEMPLATE|IFRAME)$/.test(child.tagName)) continue;
      const r = child.getBoundingClientRect();
      const visible = r.width && r.height && r.right > c.x && r.left < c.x + c.w && r.bottom > c.y && r.top < c.y + c.h;
      // Foundation generates ids such as "6ys753-accordion-label" on every load.
      const id = child.id && !/^[a-z0-9]{6}-/.test(child.id) ? "#" + child.id : "";
      const sig = child.tagName.toLowerCase() + id + (child.classList[0] ? "." + child.classList[0] : "");
      const n = (seen[sig] = (seen[sig] ?? -1) + 1);
      const key = `${prefix}>${sig}${n ? ":" + n : ""}`;
      if (!visible && getComputedStyle(child).display === "none") continue;
      if (visible) {
        out[key] = { r: [round(r.x - c.x), round(r.y - c.y), round(r.width), round(r.height)] };
        const text = [...child.childNodes]
          .filter((t) => t.nodeType === 3)
          .map((t) => t.data)
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
        const extra = { class: child.className.baseVal ?? child.className };
        if (text) extra.text = text.slice(0, 60);
        if (child.currentSrc) extra.src = child.currentSrc.split("/").pop();
        record(key, getComputedStyle(child), child.tagName.toLowerCase(), extra);
        for (const pseudo of ["::before", "::after"]) {
          const ps = getComputedStyle(child, pseudo);
          if (ps.content !== "none" && ps.display !== "none") record(key + pseudo, ps, "span", {});
        }
      }
      walk(child, key);
    }
  };
  const rootSig = root.tagName.toLowerCase() + (root.id ? "#" + root.id : "");
  walk(root, rootSig);
  frame.remove();
  return out;
}

/**
 * @param {string} key An element key such as section#buttons>div.row:2>a.button.
 * @return {string} The key of its parent element (for a pseudo-element: its element).
 */
const parentOf = (key) => (key.includes("::") ? key.split("::")[0] : key.slice(0, key.lastIndexOf(">")));

/**
 * @param {string} key An element key.
 * @param {object} [entry] Its record, for the text.
 * @return {string} A short readable name: the last two segments and the text.
 */
function label(key, entry) {
  const name = key.split(">").slice(-2).join(" > ");
  const text = entry?.s?.text;
  return text ? `${name} "${text.length > 24 ? text.slice(0, 24) + "…" : text}"` : name;
}

/**
 * @param {string} value A computed value.
 * @return {string} It, shortened.
 */
const short = (value) => (value === undefined ? "∅" : value.length > 40 ? value.slice(0, 40) + "…" : value);

/**
 * Compares two snapshots. A moved element is listed only if it moved unlike its parent,
 * so a shifted subtree is one line; identical changes on several elements are one line.
 *
 * @param {object} before Snapshot of the previous run.
 * @param {object} after Snapshot of this run.
 * @return {string[]} Report lines, empty if nothing changed.
 */
function layoutDiff(before, after) {
  const groups = new Map();
  const changed = new Map();
  const add = (desc, key, entry) => {
    const g = groups.get(desc) || { key, entry, n: 0 };
    g.n++;
    groups.set(desc, g);
  };
  const delta = (key) => {
    const a = before[key]?.r;
    const b = after[key]?.r;
    return a && b ? [round(b[0] - a[0]), round(b[1] - a[1])] : [0, 0];
  };

  for (const key of Object.keys(after)) {
    if (!before[key]) {
      if (before[parentOf(key)] || !after[parentOf(key)]) add("+ added", key, after[key]);
      continue;
    }
    const a = before[key];
    const b = after[key];
    const changes = [];
    if (a.r && b.r) {
      if (a.r[2] !== b.r[2] || a.r[3] !== b.r[3]) changes.push(`size ${a.r[2]}x${a.r[3]}→${b.r[2]}x${b.r[3]}`);
      const [dx, dy] = delta(key);
      const [px, py] = delta(parentOf(key));
      if (dx !== px || dy !== py) changes.push(`moved ${dx - px},${dy - py}`);
    }
    // Properties that change the same way are one entry (color and its currentColor echoes).
    const byChange = new Map();
    for (const p of new Set([...Object.keys(a.s || {}), ...Object.keys(b.s || {})])) {
      if (a.s?.[p] === b.s?.[p]) continue;
      const change = `${short(a.s?.[p])}→${short(b.s?.[p])}`;
      byChange.set(change, [...(byChange.get(change) || []), p]);
    }
    for (const [change, props] of byChange) {
      props.sort((x, y) => x.length - y.length);
      const names = props.length > 3 ? `${props.slice(0, 2).join("/")} +${props.length - 2}` : props.join("/");
      changes.push(`${names} ${change}`);
    }
    if (changes.length) changed.set(key, changes);
  }
  // A box that only resized around a changed descendant is a consequence, not a change.
  for (const [key, changes] of changed) {
    const consequence = changes.length === 1 && changes[0].startsWith("size ");
    if (!(consequence && [...changed.keys()].some((k) => k.startsWith(key + ">")))) {
      add("~ " + changes.join(", "), key, after[key]);
    }
  }
  for (const key of Object.keys(before)) {
    if (!after[key] && (after[parentOf(key)] || !before[parentOf(key)])) add("- removed", key, before[key]);
  }

  const lines = [...groups].map(([desc, g]) => {
    const [sign, rest] = [desc.slice(0, 1), desc.slice(2)];
    const what = label(g.key, g.entry) + (g.n > 1 ? ` (+${g.n - 1} alike)` : "");
    return sign === "~" ? `~ ${what}: ${rest}` : `${sign} ${what}`;
  });
  return lines.length > MAX_LINES ? [...lines.slice(0, MAX_LINES), `… ${lines.length - MAX_LINES} more`] : lines;
}

/**
 * @param {number} n A number.
 * @return {number} It rounded to one decimal.
 */
function round(n) {
  return Math.round(n * 10) / 10;
}

/**
 * Names the element a changed region lies in: the deepest one containing it.
 *
 * @param {object} snapshot A snapshot.
 * @param {object} box {x, y, w, h} in the snapshot's coordinates.
 * @return {string} A label, or "" if none contains it.
 */
function elementAt(snapshot, box) {
  let best = "";
  for (const [key, entry] of Object.entries(snapshot)) {
    const [x, y, w, h] = entry.r || [];
    if (!entry.r || key.includes("::")) continue;
    const inside = x <= box.x && y <= box.y && x + w >= box.x + box.w && y + h >= box.y + box.h;
    if (inside && key.length > best.length) best = key;
  }
  return best && label(best, snapshot[best]);
}

module.exports = { snapshotInPage, layoutDiff, elementAt };
