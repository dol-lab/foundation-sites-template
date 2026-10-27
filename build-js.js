// Builds assets/foundation.min.js from js/foundation.js. jQuery stays outside the bundle: the
// page loads it first (WordPress' own copy in Spaces), so `import $ from "jquery"` reads the global.
const result = await Bun.build({
  entrypoints: ["js/foundation.js"],
  outdir: "assets",
  naming: "foundation.min.js",
  format: "iife",
  target: "browser",
  minify: true,
  sourcemap: "linked",
  plugins: [
    {
      name: "jquery-global",
      setup(build) {
        build.onResolve({ filter: /^jquery$/ }, () => ({ path: "jquery", namespace: "global" }));
        build.onLoad({ filter: /.*/, namespace: "global" }, () => ({
          contents: "module.exports = window.jQuery;",
          loader: "js",
        }));
      },
    },
  ],
});
if (!result.success) {
  console.error(...result.logs);
  process.exit(1);
}
