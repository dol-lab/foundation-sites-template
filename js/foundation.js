// Entry of assets/foundation.min.js (`bun run build:js`): foundation-sites' own entry
// (node_modules/foundation-sites/js/entries/foundation.js) without Accordion and
// ResponsiveAccordionTabs, which nothing uses.
import $ from "jquery";

import { Foundation } from "foundation-sites/js/foundation.core";
import * as CoreUtils from "foundation-sites/js/foundation.core.utils";
import { Box } from "foundation-sites/js/foundation.util.box";
import { onImagesLoaded } from "foundation-sites/js/foundation.util.imageLoader";
import { Keyboard } from "foundation-sites/js/foundation.util.keyboard";
import { MediaQuery } from "foundation-sites/js/foundation.util.mediaQuery";
import { Motion, Move } from "foundation-sites/js/foundation.util.motion";
import { Nest } from "foundation-sites/js/foundation.util.nest";
import { Timer } from "foundation-sites/js/foundation.util.timer";
import { Touch } from "foundation-sites/js/foundation.util.touch";
import { Triggers } from "foundation-sites/js/foundation.util.triggers";
import { Abide } from "foundation-sites/js/foundation.abide";
import { AccordionMenu } from "foundation-sites/js/foundation.accordionMenu";
import { Drilldown } from "foundation-sites/js/foundation.drilldown";
import { Dropdown } from "foundation-sites/js/foundation.dropdown";
import { DropdownMenu } from "foundation-sites/js/foundation.dropdownMenu";
import { Equalizer } from "foundation-sites/js/foundation.equalizer";
import { Interchange } from "foundation-sites/js/foundation.interchange";
import { Magellan } from "foundation-sites/js/foundation.magellan";
import { OffCanvas } from "foundation-sites/js/foundation.offcanvas";
import { Orbit } from "foundation-sites/js/foundation.orbit";
import { ResponsiveMenu } from "foundation-sites/js/foundation.responsiveMenu";
import { ResponsiveToggle } from "foundation-sites/js/foundation.responsiveToggle";
import { Reveal } from "foundation-sites/js/foundation.reveal";
import { Slider } from "foundation-sites/js/foundation.slider";
import { SmoothScroll } from "foundation-sites/js/foundation.smoothScroll";
import { Sticky } from "foundation-sites/js/foundation.sticky";
import { Tabs } from "foundation-sites/js/foundation.tabs";
import { Toggler } from "foundation-sites/js/foundation.toggler";
import { Tooltip } from "foundation-sites/js/foundation.tooltip";

Foundation.addToJquery($);

// Utils on the Foundation global, as in foundation-sites' entry.
Object.assign(Foundation, {
  rtl: CoreUtils.rtl,
  GetYoDigits: CoreUtils.GetYoDigits,
  transitionend: CoreUtils.transitionend,
  RegExpEscape: CoreUtils.RegExpEscape,
  onLoad: CoreUtils.onLoad,
  Box,
  onImagesLoaded,
  Keyboard,
  MediaQuery,
  Motion,
  Move,
  Nest,
  Timer,
});

Touch.init($);
Triggers.init($, Foundation);
MediaQuery._init();

const plugins = {
  Abide,
  AccordionMenu,
  Drilldown,
  Dropdown,
  DropdownMenu,
  Equalizer,
  Interchange,
  Magellan,
  OffCanvas,
  Orbit,
  ResponsiveMenu,
  ResponsiveToggle,
  Reveal,
  Slider,
  SmoothScroll,
  Sticky,
  Tabs,
  Toggler,
  Tooltip,
};
for (const [name, plugin] of Object.entries(plugins)) Foundation.plugin(plugin, name);

// The stock UMD build put every export on window; keep those globals.
Object.assign(window, {
  Foundation,
  CoreUtils,
  Box,
  onImagesLoaded,
  Keyboard,
  MediaQuery,
  Motion,
  Nest,
  Timer,
  Touch,
  Triggers,
  ...plugins,
});
