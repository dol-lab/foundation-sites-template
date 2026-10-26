// One call after an edit: `bun run check [id|state…]` builds the CSS and the page, lints, and
// shoots the given sections (all without arguments). Prints only failures and the shots that
// are new or changed; exits non-zero if a step failed.
const { spawnSync } = require("node:child_process");

const STEPS = [
  ["build", ["run", "build"]],
  ["build:html", ["build-html.js"]],
  ["lint", ["run", "lint"]],
];

let failed = false;
for (const [name, args] of STEPS) {
  const run = spawnSync(process.execPath, args, { cwd: __dirname, encoding: "utf8" });
  if (run.status !== 0) {
    console.log(`✗ ${name}\n${(run.stdout + run.stderr).trim().split("\n").slice(-30).join("\n")}`);
    failed = true;
  }
}

if (!failed) {
  const shots = spawnSync(process.execPath, ["shots.js", ...process.argv.slice(2)], {
    cwd: __dirname,
    encoding: "utf8",
  });
  const lines = (shots.stdout + shots.stderr).trim().split("\n").filter(Boolean);
  const quiet = (l) => l.startsWith("unchanged") || l.startsWith("noise");
  const count = (prefix) => lines.filter((l) => l.startsWith(prefix)).length;
  lines.filter((l) => !quiet(l)).forEach((l) => console.log(l));
  const noise = count("noise") ? `, ${count("noise")} noise: pixels only, see \`bun run shots\`` : "";
  console.log(`${shots.status ? "✗" : "✓"} build, lint, shots (${count("unchanged")} unchanged${noise})`);
  failed = shots.status !== 0;
}
process.exit(failed ? 1 : 0);
