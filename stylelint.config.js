// Each exception says why the standard rule does not fit this code.
module.exports = {
  extends: ["stylelint-config-standard-scss"],
  plugins: ["@stylistic/stylelint-plugin"],
  rules: {
    // Stylelint 16 dropped its stylistic rules; Prettier cannot format the SCSS (.prettierignore). Plugin 4.x:
    // 5.x needs stylelint 17. It misreads continuation lines of a multi-line @if / @return or of one
    // comma-separated value layer, so keep those on one line.
    "@stylistic/indentation": 2,
    // Nested component rules are ordered on purpose; the rule cannot follow nesting and @include.
    "no-descending-specificity": null,
    // `--_name` is a private custom property, `--f-palette--name` a modifier.
    "custom-property-pattern": [
      "^_?[a-z][a-z0-9]*(-{1,2}[a-z0-9]+)*$",
      { message: (name) => `Expected custom property "${name}" to be kebab-case, optionally --_private` },
    ],
    // `$_` takes a return value that is not used.
    "scss/dollar-variable-pattern": [
      "^(_|-?[a-z][a-z0-9]*(-[a-z0-9]+)*)$",
      { message: (name) => `Expected variable "${name}" to be kebab-case or $_` },
    ],
    // Foundation tells null from false: `@if not $x` would also skip a deliberate false.
    "scss/at-if-no-null": null,
    // The extended classes are public markup too, so they cannot become placeholders.
    "scss/at-extend-no-missing-placeholder": null,
    // There is no autoprefixer: these prefixes are written by hand because Safari still needs them.
    "property-no-vendor-prefix": [true, { ignoreProperties: ["user-select", "text-size-adjust", "text-decoration"] }],
    // Constants such as the sRGB threshold 0.03928 and the breakpoint gap 0.00125 need five places.
    "number-max-precision": 5,
    // Reads the lightness in relative color syntax, oklch(from … 0.95 …), as a hue.
    "hue-degree-notation": null,
    // :not(.a):not(.b) is more specific than :not(.a, .b); which one is meant is decided per selector.
    "selector-not-notation": null,
    // Icon fonts have no generic fallback that would render the icon.
    "font-family-no-missing-generic-family-keyword": [true, { ignoreFontFamilies: ["Font Awesome 7 Free"] }],
    // normalize.css repeats monospace on purpose (it resets the browser's smaller monospace size).
    "font-family-no-duplicate-names": [true, { ignoreFontFamilyNames: ["monospace"] }],
  },
};
