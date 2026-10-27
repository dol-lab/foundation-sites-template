// Shared by the scripts that look at the built page (shots.js, probe.js).
// Playwright comes from spaces-markup (this package is installed in its vendor/);
// set CHROME to use a browser other than /usr/bin/chromium or Playwright's own.
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const PAGE_URL = "file://" + path.join(ROOT, "index.html");
const CONFIG = path.join(ROOT, "shots.config.js");
const STATES = fs.existsSync(CONFIG) ? require(CONFIG) : {};
const HEIGHT = 900;

/**
 * Loads Playwright from this package or from the spaces-markup it is installed in.
 *
 * @return {object} The playwright module.
 */
function loadPlaywright() {
  try {
    return require(require.resolve("playwright", { paths: [ROOT, path.resolve(ROOT, "../../..")] }));
  } catch {
    console.error("playwright not found: run `npm install` in spaces-markup, or `bun add -d playwright` here.");
    process.exit(2);
  }
}

/**
 * @return {Promise<object>} A launched Chromium.
 */
async function launch() {
  const { chromium } = loadPlaywright();
  const executablePath = process.env.CHROME || (fs.existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined);
  return chromium.launch({ executablePath });
}

/**
 * Opens the demo page in a stable state: reference sections unfolded, lazy images loaded
 * (otherwise they load on some runs only) and the page background flat (the body gradient
 * shows through sections and depends on their offset, so a change above would move it).
 *
 * @param {object} browser Playwright browser.
 * @param {number} width Viewport width.
 * @return {Promise<object>} The page.
 */
async function openDemo(browser, width) {
  const page = await browser.newPage({ viewport: { width, height: HEIGHT }, reducedMotion: "reduce" });
  await page.goto(PAGE_URL, { waitUntil: "load" });
  await page.addStyleTag({ content: "body { background-image: none !important; }" });
  await page.evaluate(() => {
    document.querySelectorAll(".demo-section > details").forEach((el) => (el.open = true));
    const images = [...document.images].map((img) => {
      img.loading = "eager";
      return img.decode().catch(() => {});
    });
    return Promise.all([document.fonts.ready, ...images]);
  });
  return page;
}

/**
 * Applies an interaction state from shots.config.js and returns what to shoot.
 *
 * @param {object} page The demo page.
 * @param {object} state { click: [selector…], focus?: selector, target?: selector }.
 * @return {Promise<object|null>} A locator, or null to shoot the viewport.
 */
async function applyState(page, state) {
  for (const selector of state.click || []) {
    await page.locator(selector).first().click({ timeout: 3000 });
  }
  // Keyboard focus: a key press after focusing, or :focus-visible follows the last click.
  if (state.focus) {
    await page.locator(state.focus).first().focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
  }
  // Foundation's dropdown menu marks the opened parent after its hover delay (a timer, not motion).
  await page.waitForTimeout(100);
  // Under reduced motion a transition still ends one frame later.
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  return state.target ? page.locator(state.target).first() : null;
}

module.exports = { ROOT, STATES, HEIGHT, launch, openDemo, applyState };
