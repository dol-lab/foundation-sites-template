// Screenshots of the demo page into shots/: one PNG per section (and the header) and width,
// plus the interaction states in shots.config.js. `bun run shots [id|state…] [--scheme=light|dark]`
// (all without arguments; both color schemes without --scheme, dark ones as <id>@<width>-dark.png).
// Shots taller than MAX_HEIGHT are split into <id>@<width>-<n>.png.
// Each shot also stores its elements (box, style, text) in <stem>.json. A changed shot is
// reported as text: the changed regions with the element they lie in, then what changed in
// the elements. Pixels that changed with no element changing are reported as noise.
// A changed shot keeps the old one as .prev.png and gets a .diff.png (old | new per region)
// until it changes again.
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, STATES, HEIGHT, launch, openDemo, applyState } = require("./lib/browser");
const { snapshotInPage, layoutDiff, elementAt } = require("./lib/layout");

const WIDTHS = [375, 1280];
const SCHEMES = ["light", "dark"];
const MAX_HEIGHT = 1600;
const MAX_REGIONS = 4;
const MAX_CROP = 600;
const OUT = path.join(ROOT, "shots");

/**
 * Image work done in a blank page, so no image library is needed.
 *
 * @param {object} page A blank Playwright page.
 * @return {object} slice() and diff(), both on PNG buffers.
 */
function imageTools(page) {
  const run = (fn, ...args) => page.evaluate(fn, args);
  const b64 = (buf) => buf.toString("base64");
  const buf = (dataUrl) => Buffer.from(dataUrl.split(",")[1], "base64");

  const browserSide = async ([kind, a, b, max, maxRegions, maxCrop]) => {
    const load = async (s) => createImageBitmap(await (await fetch("data:image/png;base64," + s)).blob());
    const canvas = (w, h) => {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      return [c, c.getContext("2d", { willReadFrequently: true })];
    };
    const img = await load(a);
    if (kind === "slice") {
      if (img.height <= max) return [];
      const out = [];
      for (let y = 0; y < img.height; y += max) {
        const h = Math.min(max, img.height - y);
        const [c, ctx] = canvas(img.width, h);
        ctx.drawImage(img, 0, y, img.width, h, 0, 0, img.width, h);
        out.push(c.toDataURL("image/png"));
      }
      return out;
    }
    const old = await load(b);
    const w = Math.max(img.width, old.width);
    const h = Math.max(img.height, old.height);
    const pixels = (bitmap) => {
      const [, ctx] = canvas(w, h);
      ctx.drawImage(bitmap, 0, 0);
      return ctx.getImageData(0, 0, w, h).data;
    };
    const p1 = pixels(old);
    const p2 = pixels(img);
    // Changed pixels are binned into CELL squares; touching cells form one region.
    const CELL = 24;
    const cols = Math.ceil(w / CELL);
    const cells = new Map();
    let count = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        if (p1[i] !== p2[i] || p1[i + 1] !== p2[i + 1] || p1[i + 2] !== p2[i + 2] || p1[i + 3] !== p2[i + 3]) {
          count++;
          const cell = Math.floor(y / CELL) * cols + Math.floor(x / CELL);
          const c = cells.get(cell) || { x0: x, y0: y, x1: x, y1: y, n: 0 };
          c.x0 = Math.min(c.x0, x);
          c.y0 = Math.min(c.y0, y);
          c.x1 = Math.max(c.x1, x);
          c.y1 = Math.max(c.y1, y);
          c.n++;
          cells.set(cell, c);
        }
      }
    }
    if (!count) return { count };
    const regions = [];
    for (const start of cells.keys()) {
      if (!cells.has(start)) continue;
      const r = { x0: w, y0: h, x1: 0, y1: 0, n: 0 };
      const todo = [start];
      while (todo.length) {
        const cell = todo.pop();
        const c = cells.get(cell);
        if (!c) continue;
        cells.delete(cell);
        r.x0 = Math.min(r.x0, c.x0);
        r.y0 = Math.min(r.y0, c.y0);
        r.x1 = Math.max(r.x1, c.x1);
        r.y1 = Math.max(r.y1, c.y1);
        r.n += c.n;
        const [cy, cx] = [Math.floor(cell / cols), cell % cols];
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (cx + dx >= 0 && cx + dx < cols) todo.push((cy + dy) * cols + cx + dx);
          }
        }
      }
      regions.push({ x: r.x0, y: r.y0, w: r.x1 - r.x0 + 1, h: r.y1 - r.y0 + 1, n: r.n });
    }
    regions.sort((a, b) => b.n - a.n);
    // The crop holds the largest regions as old | new rows, each at most maxCrop wide and high.
    const pad = 8;
    const gap = 8;
    const shown = regions.slice(0, maxRegions).map((r) => {
      const x = Math.max(0, r.x - pad);
      const y = Math.max(0, r.y - pad);
      return { x, y, w: Math.min(maxCrop, w - x, r.w + 2 * pad), h: Math.min(maxCrop, h - y, r.h + 2 * pad) };
    });
    const width = Math.max(...shown.map((b) => b.w)) * 2 + gap;
    const height = shown.reduce((sum, b) => sum + b.h + gap, -gap);
    const [c, ctx] = canvas(width, height);
    ctx.fillStyle = "#f0f";
    ctx.fillRect(0, 0, width, height);
    let top = 0;
    for (const b of shown) {
      ctx.drawImage(old, b.x, b.y, b.w, b.h, 0, top, b.w, b.h);
      ctx.drawImage(img, b.x, b.y, b.w, b.h, (width - gap) / 2 + gap, top, b.w, b.h);
      top += b.h + gap;
    }
    return {
      count,
      regions,
      size:
        old.width !== img.width || old.height !== img.height
          ? `${old.width}x${old.height} → ${img.width}x${img.height}`
          : "",
      crop: c.toDataURL("image/png"),
    };
  };

  return {
    slice: async (png) => (await run(browserSide, "slice", b64(png), null, MAX_HEIGHT)).map(buf),
    diff: async (png, old) => {
      const result = await run(browserSide, "diff", b64(png), b64(old), null, MAX_REGIONS, MAX_CROP);
      return result.crop ? { ...result, crop: buf(result.crop) } : result;
    },
  };
}

/**
 * Writes a shot (or one part of it) and describes how it differs from the previous run.
 *
 * @param {object} tools From imageTools().
 * @param {string} file Target path.
 * @param {Buffer} png The new image.
 * @param {object} where { snapshot, offset, quiet }: names regions; quiet = no element changed.
 * @return {Promise<string>} The report line.
 */
async function save(tools, file, png, where) {
  const rel = path.relative(ROOT, file);
  const prev = file.replace(/\.png$/, ".prev.png");
  const diffFile = file.replace(/\.png$/, ".diff.png");
  const old = fs.existsSync(file) ? fs.readFileSync(file) : null;
  if (!old) {
    fs.rmSync(prev, { force: true });
    fs.rmSync(diffFile, { force: true });
    fs.writeFileSync(file, png);
    return `new       ${rel}`;
  }
  if (old.equals(png)) {
    return `unchanged ${rel}`;
  }
  const diff = await tools.diff(png, old);
  if (!diff.count) {
    return `unchanged ${rel}`;
  }
  fs.writeFileSync(prev, old);
  fs.writeFileSync(file, png);
  fs.writeFileSync(diffFile, diff.crop);
  const size = diff.size ? `, size ${diff.size}` : "";
  const regions = diff.regions.slice(0, MAX_REGIONS).map((r) => {
    const inside = elementAt(where.snapshot, { ...r, y: r.y + where.offset });
    return `${r.x},${r.y} ${r.w}x${r.h}${inside ? ` in ${inside}` : ""}`;
  });
  const more = diff.regions.length > MAX_REGIONS ? `, +${diff.regions.length - MAX_REGIONS} more` : "";
  const status = where.quiet ? "noise    " : "changed  ";
  return `${status} ${rel}: ${diff.count} px${size}; ${regions.join("; ")}${more} → ${path.relative(ROOT, diffFile)}`;
}

/**
 * Writes one shot, split into parts if it is tall, removes parts left from a taller one, and
 * compares its elements with the previous run.
 *
 * @param {object} tools From imageTools().
 * @param {string} stem File name without extension, e.g. buttons@375.
 * @param {Buffer} png The new image.
 * @param {object} snapshot Its elements, from snapshotInPage().
 * @return {Promise<string[]>} Report lines.
 */
async function saveSplit(tools, stem, png, snapshot) {
  const snapFile = path.join(OUT, `${stem}.json`);
  const before = fs.existsSync(snapFile) ? JSON.parse(fs.readFileSync(snapFile, "utf8")) : null;
  fs.writeFileSync(snapFile, JSON.stringify(snapshot));
  const changes = before ? layoutDiff(before, snapshot) : [];

  const parts = await tools.slice(png);
  const files = parts.length ? parts.map((_p, i) => `${stem}-${i + 1}`) : [stem];
  for (const name of fs.readdirSync(OUT)) {
    const base = name.replace(/(\.prev|\.diff)?\.png$/, "");
    if ((base === stem || base.match(/^(.*)-\d+$/)?.[1] === stem) && !files.includes(base)) {
      fs.rmSync(path.join(OUT, name));
    }
  }
  const lines = [];
  for (const [i, name] of files.entries()) {
    const where = { snapshot, offset: i * MAX_HEIGHT, quiet: before && !changes.length };
    lines.push(await save(tools, path.join(OUT, `${name}.png`), parts[i] || png, where));
  }
  if (lines.some((l) => l.startsWith("changed"))) lines.push(...changes.map((l) => `          ${l}`));
  return lines;
}

/**
 * Puts a section at the top of a viewport it fits in, on whole pixels. Chromium renders an
 * element differently depending on where it sits, and shifts one taller than the viewport
 * while capturing it, so an edit above it, or nothing at all, would change its shot.
 *
 * @param {object} target Locator of the element.
 * @param {object} page Its page.
 * @return {Promise<void>}
 */
async function pin(target, page) {
  const { width } = page.viewportSize();
  const { height } = await target.boundingBox();
  if (height > HEIGHT) await page.setViewportSize({ width, height: Math.ceil(height) });
  await target.evaluate((el) => {
    el.scrollIntoView({ block: "start", behavior: "instant" });
    const r = el.getBoundingClientRect();
    const [dx, dy] = [Math.round(r.x) - r.x, Math.round(r.y) - r.y];
    if (dx || dy) el.style.translate = `${dx}px ${dy}px`;
  });
}

/**
 * Undoes pin().
 *
 * @param {object} target Locator of the element.
 * @param {object} page Its page.
 * @return {Promise<void>}
 */
async function unpin(target, page) {
  await target.evaluate((el) => (el.style.translate = ""));
  const { width, height } = page.viewportSize();
  if (height !== HEIGHT) await page.setViewportSize({ width, height: HEIGHT });
}

(async () => {
  const browser = await launch();
  const tools = imageTools(await browser.newPage());
  fs.mkdirSync(OUT, { recursive: true });
  const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const scheme = process.argv.find((a) => a.startsWith("--scheme="))?.split("=")[1];
  const schemes = scheme ? [scheme] : SCHEMES;
  let failed = false;

  try {
    for (const width of WIDTHS) {
      for (const colorScheme of schemes) {
        const suffix = colorScheme === "light" ? "" : `-${colorScheme}`;
        const page = await openDemo(browser, width, colorScheme);
        const sections = await page.$$eval("nav[id], section[id]", (els) => els.map((el) => el.id));
        const names = args.length ? args : [...sections, ...Object.keys(STATES)];

        for (const name of names) {
          const state = STATES[name];
          if (state?.widths && !state.widths.includes(width)) continue;
          // A state is clicked into a page of its own, so the sections are shot untouched.
          const statePage = state ? await openDemo(browser, width, colorScheme) : null;
          try {
            let target;
            if (state) {
              target = (await applyState(statePage, state)) || statePage;
            } else {
              target = page.locator(`[id="${name}"]`);
              if (!(await target.count())) throw new Error("no such section or state");
            }
            const viewport = target === statePage;
            if (!viewport) await pin(target, page);
            const snapshot = viewport
              ? await statePage.locator("html").evaluate(snapshotInPage, { x: 0, y: 0, w: width, h: HEIGHT })
              : await target.evaluate(snapshotInPage, null);
            const png = await target.screenshot({ animations: "disabled" });
            if (!viewport) await unpin(target, page);
            (await saveSplit(tools, `${name}@${width}${suffix}`, png, snapshot)).forEach((line) => console.log(line));
          } catch (err) {
            console.error(`failed    ${name}@${width}${suffix}: ${err.message.split("\n")[0]}`);
            failed = true;
          } finally {
            await statePage?.close();
          }
        }
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
  process.exit(failed ? 1 : 0);
})();
