// `bun glass-check.js [--all]` (part of `bun run check`): the worst contrast of `--f-glass-color` on `--f-glass-*` over any image.
// The backdrop's blur averages an image into smooth color, so behind a glyph can be any color c; what shows is the
// glass fill over saturate(c). That is computed for every c on a grid, per mode and theme, and fails under 4.5:1. The
// halo is left out (it only adds contrast). Before trusting the model it renders the glass over a few solid colors and
// compares the pixels, so a browser that filters differently fails the check instead of passing it.
// Prints one line per failing case (all with --all); exits 1 on a failure.
const zlib = require("node:zlib");
const { launch, openDemo } = require("./lib/browser");

const MIN = 4.5;
const STEPS = 16; // grid of (STEPS + 1)³ backdrop colors
// No theme, greys and a hue circle, as `--f-color-theme` on a `themed` element.
const THEMES = [
  null,
  "#000",
  "#fff",
  "#808080",
  ...Array.from({ length: 12 }, (_, i) => `oklch(0.6 0.2 ${i * 30})`),
  "oklch(0.85 0.15 100)",
  "oklch(0.3 0.15 270)",
];
const SAMPLES = ["#000", "#fff", "#f00", "#0f0", "#00f", "#808080", "#c06030"];

/**
 * Resolves the glass tokens of a `themed` probe in the page to sRGB bytes.
 *
 * @param {object} page The demo page.
 * @param {string|null} theme A `--f-color-theme` value, or null for the page's own.
 * @return {Promise<object>} { glass: [r,g,b,a], text: [r,g,b], backdrop: string }.
 */
function resolve(page, theme) {
  return page.evaluate((theme) => {
    const el = document.createElement("div");
    if (theme) {
      el.setAttribute("themed", "");
      el.style.setProperty("--f-color-theme", theme);
    }
    el.style.cssText +=
      "background: var(--f-glass-background); color: var(--f-glass-color); backdrop-filter: var(--f-glass-backdrop)";
    document.body.append(el);
    const s = getComputedStyle(el);
    const ctx = Object.assign(document.createElement("canvas"), { width: 1, height: 1 }).getContext("2d", {
      willReadFrequently: true,
    });
    const rgba = (c) => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = c;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
      return [r, g, b, a / 255];
    };
    const out = { glass: rgba(s.backgroundColor), text: rgba(s.color).slice(0, 3), backdrop: s.backdropFilter };
    el.remove();
    return out;
  }, theme);
}

/**
 * Reads the filter functions this model knows; anything else would make it lie.
 *
 * @param {string} filter Computed `backdrop-filter`.
 * @return {number} The saturate amount (1 = none).
 */
function saturation(filter) {
  let amount = 1;
  for (const [, name, arg] of filter.matchAll(/([a-z-]+)\(([^)]*)\)/g)) {
    if (name === "saturate") amount *= arg.endsWith("%") ? parseFloat(arg) / 100 : parseFloat(arg);
    else if (name !== "blur") throw new Error(`glass-check models blur() and saturate() only, not ${name}()`);
  }
  return amount;
}

/**
 * saturate(s) as in Filter Effects (applied to gamma-encoded sRGB, as browsers do), clamped.
 *
 * @param {number[]} c [r, g, b] bytes.
 * @param {number} s Amount.
 * @return {number[]} [r, g, b] bytes.
 */
function saturate([r, g, b], s) {
  const m = [
    [0.213 + 0.787 * s, 0.715 - 0.715 * s, 0.072 - 0.072 * s],
    [0.213 - 0.213 * s, 0.715 + 0.285 * s, 0.072 - 0.072 * s],
    [0.213 - 0.213 * s, 0.715 - 0.715 * s, 0.072 + 0.928 * s],
  ];
  return m.map(([x, y, z]) => Math.min(255, Math.max(0, x * r + y * g + z * b)));
}

/**
 * @param {number[]} glass [r, g, b, a].
 * @param {number[]} c Backdrop [r, g, b] bytes.
 * @param {number} s Saturate amount.
 * @return {number[]} What shows through the glass, [r, g, b] bytes.
 */
function through(glass, c, s) {
  const a = glass[3];
  return saturate(c, s).map((v, i) => glass[i] * a + v * (1 - a));
}

/**
 * @param {number[]} c [r, g, b] bytes.
 * @return {number} WCAG relative luminance.
 */
function luminance(c) {
  const [r, g, b] = c.map((v) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * @param {number[]} a [r, g, b] bytes.
 * @param {number[]} b [r, g, b] bytes.
 * @return {number} WCAG contrast ratio.
 */
function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * @param {number[]} c [r, g, b] bytes.
 * @return {string} #rrggbb.
 */
function hex(c) {
  return "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
}

/**
 * The first pixel of a PNG screenshot of one pixel (8-bit RGB or RGBA, as Chromium writes it): with nothing to the
 * left or above, every PNG row filter leaves the bytes as they are.
 *
 * @param {Buffer} png The screenshot.
 * @return {number[]} [r, g, b] bytes.
 */
function firstPixel(png) {
  const idat = [];
  for (let at = 8; at < png.length;) {
    const length = png.readUInt32BE(at);
    if (png.toString("ascii", at + 4, at + 8) === "IDAT") idat.push(png.subarray(at + 8, at + 8 + length));
    at += length + 12;
  }
  return [...zlib.inflateSync(Buffer.concat(idat)).subarray(1, 4)];
}

/**
 * Renders the glass over solid colors and returns the worst gap to the model, in bytes.
 *
 * @param {object} page The demo page.
 * @param {object} tokens From resolve() for the page's own theme.
 * @return {Promise<object>} { gap, sample, seen, model }.
 */
async function calibrate(page, tokens) {
  const s = saturation(tokens.backdrop);
  let worst = { gap: -1 };
  for (const sample of SAMPLES) {
    await page.evaluate((sample) => {
      document.getElementById("glass-check")?.remove();
      document.body.insertAdjacentHTML(
        "beforeend",
        `<div id="glass-check" style="position:fixed;inset:0;z-index:2147483647;background:${sample}">` +
          '<div style="position:absolute;inset:100px;background:var(--f-glass-background);backdrop-filter:var(--f-glass-backdrop)"></div></div>',
      );
    }, sample);
    const seen = firstPixel(
      await page.screenshot({ clip: { x: 200, y: 200, width: 1, height: 1 }, animations: "disabled" }),
    );
    const c = await page.evaluate(() => {
      const [r, g, b] = getComputedStyle(document.getElementById("glass-check"))
        .backgroundColor.match(/[\d.]+/g)
        .map(Number);
      return [r, g, b];
    });
    const model = through(tokens.glass, c, s);
    const gap = Math.max(...model.map((v, i) => Math.abs(v - seen[i])));
    if (gap > worst.gap) worst = { gap, sample, seen, model };
  }
  await page.evaluate(() => document.getElementById("glass-check")?.remove());
  return worst;
}

(async () => {
  const all = process.argv.includes("--all");
  const browser = await launch();
  let failed = false;
  try {
    for (const scheme of ["light", "dark"]) {
      const page = await openDemo(browser, 800, scheme, { deviceScaleFactor: 1 });
      const own = await resolve(page, null);
      const cal = await calibrate(page, own);
      if (cal.gap > 4) {
        console.log(
          `✗ glass ${scheme}: the browser shows ${hex(cal.seen)} over ${cal.sample}, the model ${hex(cal.model)}: fix the model`,
        );
        failed = true;
      }
      for (const theme of THEMES) {
        const tokens = theme ? await resolve(page, theme) : own;
        const s = saturation(tokens.backdrop);
        let worst = { r: Infinity };
        const step = 255 / STEPS;
        for (let r = 0; r <= 255; r += step)
          for (let g = 0; g <= 255; g += step)
            for (let b = 0; b <= 255; b += step) {
              const shown = through(tokens.glass, [r, g, b], s);
              const q = ratio(tokens.text, shown);
              if (q < worst.r) worst = { r: q, c: [r, g, b], shown };
            }
        const fail = worst.r < MIN;
        failed ||= fail;
        if (fail || all) {
          console.log(
            `${fail ? "✗" : "✓"} glass ${scheme} ${theme ?? "page theme"}: ${worst.r.toFixed(2)}:1, text ${hex(tokens.text)} on ${hex(worst.shown)} (image ${hex(worst.c)})`,
          );
        }
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
  process.exit(failed ? 1 : 0);
})();
