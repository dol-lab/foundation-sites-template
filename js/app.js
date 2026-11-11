(() => {
  // Script animations (a consumer's jQuery slides, the tab panels below) are not CSS, so the reduced-motion rule
  // misses them. Read per animation, it follows both the device and a `data-motion` setting on <html> (_motion.scss).
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  /** @return {boolean} Whether animations should jump to their end. */
  const motionOff = () => {
    const setting = document.documentElement.dataset.motion;
    return setting === "reduce" || (setting !== "full" && reducedMotion.matches);
  };
  if (window.jQuery) Object.defineProperty(window.jQuery.fx, "off", { configurable: true, get: motionOff });
  /** @param {Function} fn Runs once the DOM is parsed, and never before the rest of this file. */
  const ready = (fn) =>
    document.readyState === "loading"
      ? document.addEventListener("DOMContentLoaded", fn, { once: true })
      : queueMicrotask(fn);

  // Focus mode: `data-focus-mode` on <html> says whether the focused element shows its ring. "keyboard": focus
  // came by keyboard (or by a script after a key). "pointer": by mouse or touch; a text field matches `:focus-visible`
  // on a click too, so CSS hides its ring then. "typing": a key edited the focused text field, whose caret and focus
  // border now mark it; moving focus by keyboard brings the ring back.
  const textField =
    'input:not([type="checkbox"], [type="radio"], [type="range"], [type="color"], [type="file"], [type="button"], [type="submit"], [type="reset"]), textarea';
  const html = document.documentElement;
  let keyboard = true;
  document.addEventListener(
    "keydown",
    (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      keyboard = true;
      const edits = e.key.length === 1 || ["Backspace", "Delete", "Enter"].includes(e.key);
      if (edits && (e.target.isContentEditable || e.target.matches?.(textField))) html.dataset.focusMode = "typing";
    },
    true,
  );
  document.addEventListener("pointerdown", () => (keyboard = false), true);
  document.addEventListener("focusin", () => (html.dataset.focusMode = keyboard ? "keyboard" : "pointer"), true);

  /**
   * Tabs: `.tabs[data-tabs]` with an id, whose `.tabs-title` links name their `.tabs-panel` by `href="#id"` or
   * `data-tabs-target`. Delegated; init (on DOM ready, or the first click for a later one) adds the ARIA roles
   * and `hidden` and selects the tab the URL's #hash names (also on `hashchange`). Arrow keys, Home and End move
   * between titles and select them.
   * The server marks the initial title and panel `.is-active`, or `data-link-active-class`/`data-panel-active-class`.
   * `data-active-collapse`: the active tab's title closes it. `data-deep-link`: a change writes the panel's id to
   * the URL. `data-transition`: the panels' box eases to its new height. A change fires a bubbling `tabchange` on the `.tabs`,
   * `detail: { title, panel }` (both null after a collapse).
   */
  const tabs = {
    /**
     * @param {Element} title A `.tabs-title`.
     * @return {?HTMLAnchorElement} Its link.
     */
    link: (title) => title.querySelector("a"),

    /**
     * @param {Element} title A `.tabs-title`.
     * @return {?Element} The panel its link names.
     */
    panel: (title) => {
      const a = tabs.link(title);
      const id = a?.dataset.tabsTarget || a?.hash.slice(1);
      return id ? document.getElementById(id) : null;
    },

    /**
     * @param {Element} list A `.tabs[data-tabs]`.
     * @return {string[]} Its title and panel active classes.
     */
    classes: (list) => [list.dataset.linkActiveClass || "is-active", list.dataset.panelActiveClass || "is-active"],

    /**
     * Sets a title and its panel active or not.
     * @param {Element} list The `.tabs`.
     * @param {Element} title One of its `.tabs-title`.
     * @param {boolean} on Active.
     * @return {void}
     */
    mark: (list, title, on) => {
      const [titleClass, panelClass] = tabs.classes(list);
      const a = tabs.link(title);
      const panel = tabs.panel(title);
      title.classList.toggle(titleClass, on);
      a?.setAttribute("aria-selected", on);
      a?.setAttribute("tabindex", on ? 0 : -1);
      panel?.classList.toggle(panelClass, on);
      if (panel) panel.hidden = !on;
    },

    /**
     * Adds the roles and the state the server marked.
     * @param {Element} list A `.tabs[data-tabs]`.
     * @return {void}
     */
    init: (list) => {
      const titleClass = tabs.classes(list)[0];
      list.setAttribute("role", "tablist");
      list.querySelectorAll(".tabs-title").forEach((title) => {
        const a = tabs.link(title);
        const panel = tabs.panel(title);
        if (!a) return;
        title.setAttribute("role", "presentation");
        a.setAttribute("role", "tab");
        if (panel) {
          a.id ||= panel.id + "-label";
          a.setAttribute("aria-controls", panel.id);
          panel.setAttribute("role", "tabpanel");
          panel.setAttribute("aria-labelledby", a.id);
        }
        tabs.mark(list, title, title.classList.contains(titleClass));
      });
      // Without an active tab (collapsed) the first one keeps the list reachable by Tab.
      if (!list.querySelector(`.tabs-title.${titleClass}`))
        list.querySelector(".tabs-title a")?.setAttribute("tabindex", 0);
    },

    /**
     * Activates a title, or collapses it when it is active and its list allows that.
     * @param {Element} title A `.tabs-title`.
     * @param {boolean} [fromHash] The URL's hash asked for it: never collapse, no history write.
     * @return {void}
     */
    select: (title, fromHash = false) => {
      const list = title.closest(".tabs[data-tabs]");
      const panel = tabs.panel(title);
      if (!list) return;
      if (!list.hasAttribute("role")) tabs.init(list); // Added after DOM ready.
      const titleClass = tabs.classes(list)[0];
      const active = title.classList.contains(titleClass);
      const collapse = active && !fromHash && list.hasAttribute("data-active-collapse");
      if (active && !collapse) return;

      const box = panel?.parentElement;
      const from = box?.offsetHeight;
      list.querySelectorAll(`.tabs-title.${titleClass}`).forEach((t) => tabs.mark(list, t, false));
      if (collapse) tabs.link(title)?.setAttribute("tabindex", 0);
      else tabs.mark(list, title, true);

      if (panel && list.dataset.deepLink && !fromHash && !collapse) {
        history.replaceState(history.state, "", "#" + panel.id);
      }
      if (box && list.hasAttribute("data-transition") && !motionOff()) {
        box.animate(
          { blockSize: [from + "px", box.offsetHeight + "px"], overflow: ["clip", "clip"] },
          { duration: 250, easing: "ease-out" },
        );
      }
      list.dispatchEvent(
        new CustomEvent("tabchange", {
          bubbles: true,
          detail: collapse ? { title: null, panel: null } : { title, panel },
        }),
      );
    },

    /**
     * Selects the tab whose panel the URL's hash names.
     * @return {void}
     */
    fromHash: () => {
      const panel = document.getElementById(location.hash.slice(1)); // null without a hash
      if (!panel?.matches(".tabs-panel")) return;
      const title = [...document.querySelectorAll(".tabs[data-tabs] .tabs-title")].find((t) => tabs.panel(t) === panel);
      if (title) tabs.select(title, true);
    },
  };

  document.addEventListener("click", (e) => {
    const title = e.target.closest?.(".tabs[data-tabs] .tabs-title");
    if (!title || !tabs.link(title)) return;
    e.preventDefault();
    tabs.select(title);
  });
  document.addEventListener("keydown", (e) => {
    const title = e.target.closest?.(".tabs[data-tabs] .tabs-title");
    if (!title || e.altKey || e.ctrlKey || e.metaKey) return;
    // Enter and Space, on the link or on a title made focusable.
    if ((e.key === "Enter" || e.key === " ") && (e.target === title || e.target === tabs.link(title))) {
      e.preventDefault();
      tabs.select(title);
      return;
    }
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step && e.key !== "Home" && e.key !== "End") return;
    const titles = [...title.parentElement.children].filter((t) => t.matches(".tabs-title") && tabs.link(t));
    const next = step
      ? titles[(titles.indexOf(title) + step + titles.length) % titles.length]
      : titles.at(e.key === "Home" ? 0 : -1);
    if (!next || next === title) return;
    e.preventDefault();
    tabs.link(next).focus();
    tabs.select(next);
  });
  window.addEventListener("hashchange", tabs.fromHash);
  ready(() => {
    document.querySelectorAll(".tabs[data-tabs]").forEach(tabs.init);
    tabs.fromHash();
  });

  /**
   * Dropdown menus: in a `[data-dropdown-menu]`, a top-level item's `[popover]` child is its panel. Hovering
   * the item opens it after a moment and leaving closes it, unless it was opened by a click or clicked inside.
   * A click on the item's link toggles it; Escape, a click outside and focus leaving the item close it, not
   * while in a dialog (one opened from the panel). One panel is open at a time; its link has `aria-expanded`.
   * A closed panel is `hidden="until-found"` where supported, so find-in-page opens the one holding a match.
   * Delegated; panels are manual popovers, so other popovers and modals leave them alone. Listen for `toggle`
   * on a panel (capture: it does not bubble).
   */
  const dropdown = {
    item: "[data-dropdown-menu] > li",
    dialog: 'dialog, [role="dialog"]',
    /** @type {?HTMLElement} The open panel. */
    open: null,
    pinned: false,
    timer: 0,
    /**
     * @param {EventTarget} target An event's target.
     * @return {?HTMLElement} The panel of the item around target.
     */
    panel: (target) => target.closest?.(dropdown.item)?.querySelector(":scope > [popover]"),
    /**
     * @param {HTMLElement} panel A panel.
     * @param {boolean} pin Whether it stays open when the pointer leaves.
     */
    show(panel, pin) {
      clearTimeout(dropdown.timer);
      if (dropdown.open !== panel) {
        dropdown.hide();
        panel.showPopover();
        // Without (scoped) anchor positioning, below the item and inside the window.
        if (!CSS.supports("anchor-scope", "all")) {
          const r = panel.parentElement.getBoundingClientRect();
          panel.style.positionArea = "none";
          panel.style.top = `${r.bottom}px`;
          panel.style.left = `${Math.max(0, Math.min(r.left, document.documentElement.clientWidth - panel.offsetWidth))}px`;
        }
      }
      dropdown.pinned ||= pin;
    },
    hide() {
      clearTimeout(dropdown.timer);
      dropdown.open?.hidePopover();
    },
    /**
     * @param {HTMLElement} panel A panel.
     * @param {boolean} open Its new state.
     */
    sync(panel, open) {
      panel.parentElement.querySelector(":scope > :is(a, button)")?.setAttribute("aria-expanded", open);
      if (!("onbeforematch" in panel)) return;
      open ? panel.removeAttribute("hidden") : panel.setAttribute("hidden", "until-found");
    },
  };
  document.addEventListener(
    "beforetoggle",
    (e) => {
      if (!e.target.matches?.(`${dropdown.item} > [popover]`)) return;
      const open = e.newState === "open";
      if (open) dropdown.open = e.target;
      else if (dropdown.open === e.target) Object.assign(dropdown, { open: null, pinned: false });
      dropdown.sync(e.target, open);
    },
    true,
  );
  document.addEventListener("beforematch", (e) => {
    if (e.target.matches(`${dropdown.item} > [popover]`)) dropdown.show(e.target, true);
  });
  document.addEventListener("pointerover", (e) => {
    const panel = e.pointerType === "mouse" && dropdown.panel(e.target);
    if (!panel) return;
    clearTimeout(dropdown.timer);
    if (panel !== dropdown.open && !dropdown.pinned)
      dropdown.timer = setTimeout(() => dropdown.show(panel, false), 100);
  });
  document.addEventListener("pointerout", (e) => {
    const item = e.pointerType === "mouse" && e.target.closest?.(dropdown.item);
    if (!item || item.contains(e.relatedTarget)) return;
    clearTimeout(dropdown.timer);
    if (dropdown.open && !dropdown.pinned) dropdown.timer = setTimeout(dropdown.hide, 500);
  });
  document.addEventListener("click", (e) => {
    const link = e.target.closest?.(`${dropdown.item} > :is(a, button)`);
    const panel = link && dropdown.panel(link);
    if (panel) {
      e.preventDefault();
      dropdown.open === panel && dropdown.pinned ? dropdown.hide() : dropdown.show(panel, true);
    } else if (dropdown.open?.parentElement.contains(e.target)) dropdown.pinned = true;
    else if (dropdown.open && !e.target.closest?.(dropdown.dialog)) dropdown.hide();
  });
  document.addEventListener("keydown", (e) => {
    const item = dropdown.open?.parentElement;
    if (e.key === " " && e.target.matches?.(`${dropdown.item} > a`) && dropdown.panel(e.target)) {
      e.preventDefault();
      e.target.click();
    } else if (e.key === "Escape" && item && !e.target.closest?.(dropdown.dialog)) {
      dropdown.hide();
      if (item.contains(e.target)) item.querySelector(":scope > :is(a, button)")?.focus();
    }
  });
  document.addEventListener("focusout", (e) => {
    const item = dropdown.open?.parentElement;
    const to = e.relatedTarget;
    if (item?.contains(e.target) && to && !item.contains(to) && !to.closest(dropdown.dialog)) dropdown.hide();
  });
  ready(() =>
    document.querySelectorAll(`${dropdown.item} > [popover]`).forEach((panel) => dropdown.sync(panel, false)),
  );

  // Escape closes the innermost open `.details-menu` around the focus and focuses its summary. Capture, so a
  // dropdown panel or dialog around it stays open.
  document.addEventListener(
    "keydown",
    (e) => {
      const menu = e.key === "Escape" && e.target.closest?.("details.details-menu[open]");
      if (!menu) return;
      e.preventDefault();
      e.stopPropagation();
      menu.open = false;
      menu.querySelector(":scope > summary")?.focus();
    },
    true,
  );

  /**
   * Modals are `<dialog class="reveal">`: `[data-open="<id>"]` opens one; a click on its backdrop (the dialog
   * itself is the target, outside its box) closes it. Scripts call `showModal()`/`close()` and listen for the
   * native `close` event. A `[data-close]` button closes its modal or removes its `[data-closable]` box.
   */
  document.addEventListener("click", (e) => {
    const target = document.getElementById(e.target.closest("[data-open]")?.dataset.open);
    if (target?.matches("dialog.reveal:not([open])")) return target.showModal();
    const box = e.target.closest("[data-close]")?.closest("[data-closable], dialog.reveal");
    if (box) return box.matches("dialog") ? box.close() : box.remove();
    if (!e.target.matches("dialog.reveal[open]")) return;
    const r = e.target.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) e.target.close();
  });

  /**
   * On an open modal (`dialog.reveal` or `.reveal-overlay`), `--f-viewport-top` and `--f-viewport-height` are
   * the visible part of the layout viewport, which `_s-reveal.scss` places it in: the on-screen keyboard shrinks
   * only the visual viewport, so a sheet on the bottom edge would end up behind it. Not while zoomed in, when
   * the modal stays where the page is; zoomed out (Chrome on Android fits a page wider than the screen) it
   * still fits. Opening a modal moves the focus into it, so `focusin` covers a keyboard already up. Set on the
   * modal, not on <html>: a custom property changed on <html> restyles the whole page. Both values are read
   * before the first write, which would otherwise force a second style recalculation.
   */
  const viewport = window.visualViewport;
  if (viewport) {
    const fitModals = () => {
      const modals = document.querySelectorAll("dialog.reveal:modal, .reveal-overlay");
      if (!modals.length) return;
      const fit = viewport.scale < 1.01;
      const { offsetTop, height } = viewport;
      for (const { style } of modals) {
        if (fit) {
          style.setProperty("--f-viewport-top", `${offsetTop}px`);
          style.setProperty("--f-viewport-height", `${height}px`);
        } else {
          style.removeProperty("--f-viewport-top");
          style.removeProperty("--f-viewport-height");
        }
      }
    };
    viewport.addEventListener("resize", fitModals);
    viewport.addEventListener("scroll", fitModals);
    document.addEventListener("focusin", fitModals);
  }

  /**
   * A sheet (a modal on a phone; `_s-reveal.scss` marks it with `--_sheet: 1`) follows a finger that swipes it.
   * Its stops are its full height and, for an `.expandable` sheet, the peek it opens at (`--_sheet-peek`;
   * `data-expanded` while it is up). Let go, it moves one stop in the direction of the swipe after a short swipe
   * or a flick, and it closes only from its lowest stop: past half of what shows there, or on a hard flick after a
   * quarter. Moving between stops is a small gesture, closing a deliberate one. A text field taking the focus
   * expands the sheet (the on-screen keyboard is coming), and so does the focus landing below the screen;
   * returning to the peek takes the focus off a text field, so the keyboard goes with it. `<dialog>`s lose
   * `data-expanded` on closing. A modal that is no `<dialog>` (in a `.reveal-overlay`) is closed with Escape, which
   * its own script (React Aria) handles, guards included.
   * Touch events, not pointer events: only a non-passive touchmove keeps the browser from scrolling instead. A
   * touch is left alone on a textarea, a select or editable content, on content that takes vertical touch for
   * itself (`touch-action` without pan-y, like an image cropper), and at the top stop on a list that scrolls inside
   * the sheet (under a header that stays: the sheet is dragged by its parts that stay put). At the peek the whole
   * sheet drags, since what lies below the screen is reached by expanding. A move shorter than SLOP is still a tap.
   */
  const SLOP = 8;
  const STEP = 32;
  const sheet = {
    /** @type {?{dialog: HTMLElement, x: number, y: number, from: number, low: number, top: boolean, at: number, v: number, t: number, dragging: boolean}} */
    drag: null,
    /**
     * @param {HTMLElement}         dialog An open modal.
     * @param {CSSStyleDeclaration} style  Its computed style.
     * @return {number} How far below its top stop an expandable sheet sits at its peek; 0 for any other modal.
     */
    low(dialog, style = getComputedStyle(dialog)) {
      const peek = parseFloat(style.getPropertyValue("--_sheet-peek")) || 0;
      return peek && Math.max(0, dialog.offsetHeight - peek);
    },
    /**
     * @param {HTMLElement} dialog An open sheet.
     * @return {number} How far it is moved down now (mid-transition too): its bottom edge rests on its container's.
     */
    offset(dialog) {
      const { style } = dialog;
      const bottom = dialog.matches("dialog")
        ? (parseFloat(style.getPropertyValue("--f-viewport-top")) || 0) +
          (parseFloat(style.getPropertyValue("--f-viewport-height")) || html.clientHeight)
        : dialog.closest(".reveal-overlay").getBoundingClientRect().bottom;
      return dialog.getBoundingClientRect().bottom - bottom;
    },
    /**
     * Moves an expandable sheet to a stop. Down at the peek a text field gives up the focus, to the sheet where it
     * takes one: React Aria's focus trap would put a lost focus straight back into the field, keyboard and all.
     *
     * @param {HTMLElement} dialog The sheet.
     * @param {boolean}     up     Whether to its top stop.
     */
    expand(dialog, up) {
      if (up) {
        dialog.dataset.expanded = "";
        return;
      }
      delete dialog.dataset.expanded;
      const field = document.activeElement;
      if (!dialog.contains(field) || !(field.matches(textField) || field.isContentEditable)) return;
      if (dialog.hasAttribute("tabindex")) dialog.focus({ preventScroll: true });
      else field.blur();
    },
    /**
     * @param {Element}     el     The touched element.
     * @param {HTMLElement} dialog The open sheet around it.
     * @param {boolean}     top    Whether the sheet is at its top stop.
     * @return {boolean} Whether a swipe from el moves the sheet.
     */
    canDrag(el, dialog, top) {
      if (el.closest("textarea, select, [contenteditable]")) return false;
      for (let n = el; n !== dialog.parentElement; n = n.parentElement) {
        const { touchAction, overflowY } = getComputedStyle(n);
        if (!/auto|manipulation|pan-y/.test(touchAction)) return false;
        if (!top) continue;
        if (n === dialog ? n.scrollTop > 0 : n.scrollHeight > n.clientHeight && /auto|scroll/.test(overflowY))
          return false;
      }
      return true;
    },
    /** Lets go without a gesture: the sheet returns to the stop it is at. */
    cancel() {
      const { dialog, dragging } = sheet.drag;
      sheet.drag = null;
      if (!dragging) return;
      delete dialog.dataset.dragging;
      dialog.style.translate = "";
    },
    /**
     * Lets go: the sheet slides on from where the finger left it, to the stop the gesture asks for.
     *
     * @param {number} time When the finger lifted (event time stamp).
     */
    release(time) {
      const { dialog, dragging, from, low, top, at, v, t } = sheet.drag;
      sheet.cancel();
      if (!dragging) return;
      // A flick is fast (px/ms, + is down) at the moment of letting go; a finger that stopped first does not flick.
      const flick = time - t < 100 ? v : 0;
      const shown = dialog.offsetHeight - low;
      const lowest = !low || !top;
      if (at - low > shown / 2 || (lowest && flick > 0.8 && at - low > shown / 4)) {
        if (dialog.matches("dialog")) dialog.close();
        else dialog.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      } else if (low) {
        const moved = at - from;
        sheet.expand(dialog, moved < -STEP || flick < -0.3 ? true : moved > STEP || flick > 0.3 ? false : top);
      }
    },
  };
  document.addEventListener(
    "touchstart",
    (e) => {
      if (sheet.drag) sheet.cancel();
      const dialog = e.target.closest?.("dialog.reveal[open], .reveal-overlay .reveal");
      if (!dialog || e.touches.length > 1) return;
      const style = getComputedStyle(dialog);
      if (style.getPropertyValue("--_sheet").trim() !== "1") return;
      const low = sheet.low(dialog, style);
      const top = !low || "expanded" in dialog.dataset;
      const { clientX: x, clientY: y } = e.touches[0];
      // A `<dialog>` is also the target of a touch on its backdrop.
      if (y < dialog.getBoundingClientRect().top || !sheet.canDrag(e.target, dialog, top)) return;
      const from = Math.max(0, sheet.offset(dialog));
      sheet.drag = { dialog, x, y, from, low, top, at: from, v: 0, t: e.timeStamp, dragging: false };
    },
    { passive: true },
  );
  document.addEventListener(
    "touchmove",
    (e) => {
      const drag = sheet.drag;
      if (!drag) return;
      const { clientX, clientY } = e.touches[0];
      const dy = clientY - drag.y;
      // The first move past SLOP decides: down, or up at the peek, and more vertical than sideways drags the sheet;
      // anything else is the browser's.
      if (!drag.dragging) {
        const dx = Math.abs(clientX - drag.x);
        if (Math.max(dx, Math.abs(dy)) < SLOP) return;
        if (e.touches.length > 1 || !e.cancelable || !(dy > 0 || !drag.top) || dx > Math.abs(dy)) {
          sheet.drag = null;
          return;
        }
        drag.dragging = true;
        drag.dialog.dataset.dragging = "";
      }
      e.preventDefault();
      const at = Math.max(0, drag.from + dy);
      drag.v = (at - drag.at) / Math.max(1, e.timeStamp - drag.t);
      drag.at = at;
      drag.t = e.timeStamp;
      drag.dialog.style.translate = `0 ${at}px`;
    },
    { passive: false },
  );
  document.addEventListener("touchend", (e) => sheet.drag && sheet.release(e.timeStamp));
  document.addEventListener("touchcancel", () => sheet.drag && sheet.cancel());
  document.addEventListener("focusin", (e) => {
    const dialog = e.target.closest?.("dialog.reveal[open], .reveal-overlay .reveal");
    if (!dialog || e.target === dialog || "expanded" in dialog.dataset) return;
    const low = sheet.low(dialog);
    if (!low) return;
    // Below the screen at the peek: its first 40px do not show there (a list that scrolls starts on screen). Measured
    // within the sheet, as the focus that opening brings arrives while the sheet is still below the screen.
    const { top, height } = e.target.getBoundingClientRect();
    const below = top - dialog.getBoundingClientRect().top + Math.min(height, 40) > dialog.offsetHeight - low;
    if (below || e.target.matches(textField) || e.target.isContentEditable) sheet.expand(dialog, true);
  });
  document.addEventListener(
    "close",
    (e) => {
      if (e.target.matches?.("dialog.reveal")) delete e.target.dataset.expanded;
    },
    true,
  );

  /**
   * Tooltips: hovering, focusing or tapping a `[data-tooltip]` shows its `title` in one shared popover.
   * Delegated, so markup added later needs no init. On first contact the `title` moves to `data-tooltip`
   * (and `aria-description`), so the browser's own tooltip does not show as well. Without popover
   * support nothing moves and the browser's tooltip stays.
   * Rich content: `data-tooltip-content="<id>"` names a `hidden` element whose children the tooltip
   * shows instead; it becomes the trigger's `aria-describedby` unless that is set.
   */
  if ("showPopover" in HTMLElement.prototype) {
    const tip = document.createElement("div");
    tip.className = "tooltip";
    tip.popover = "manual";
    tip.setAttribute("aria-hidden", "true");
    let trigger = null;
    let timer = 0;

    /**
     * @param {?Element} el A tooltip trigger.
     * @return {?Element} The element holding its rich content, if it names one.
     */
    const content = (el) => (el?.dataset.tooltipContent ? document.getElementById(el.dataset.tooltipContent) : null);

    /**
     * @param {EventTarget} target An event's target.
     * @return {?Element} The tooltip trigger around target, if it has a text.
     */
    const triggerAt = (target) => {
      const el = target.closest?.("[data-tooltip]");
      if (el?.title) {
        el.dataset.tooltip = el.title;
        el.removeAttribute("title");
        if (el.getAttribute("aria-label") !== el.dataset.tooltip)
          el.setAttribute("aria-description", el.dataset.tooltip);
      }
      if (el?.dataset.tooltipContent && !el.hasAttribute("aria-describedby"))
        el.setAttribute("aria-describedby", el.dataset.tooltipContent);
      return el?.dataset.tooltip || content(el) ? el : null;
    };

    /** @return {void} */
    const hide = () => {
      clearTimeout(timer);
      if (trigger) tip.hidePopover();
      trigger = null;
    };

    /**
     * Shows el's text above it, or below where there is no room, kept inside the viewport.
     * @param {Element} el A tooltip trigger.
     * @return {void}
     */
    const show = (el) => {
      if (el === trigger) return;
      hide();
      trigger = el;
      const src = content(el);
      tip.classList.toggle("has-content", !!src);
      if (src) tip.replaceChildren(...[...src.childNodes].map((node) => node.cloneNode(true)));
      else tip.textContent = el.dataset.tooltip;
      if (!tip.isConnected) document.body.append(tip);
      tip.showPopover();
      const r = el.getBoundingClientRect();
      const t = tip.getBoundingClientRect();
      const gap = 8;
      const top = r.top - t.height - gap;
      const maxLeft = document.documentElement.clientWidth - t.width - gap;
      tip.style.top = (top < gap ? r.bottom + gap : top) + "px";
      tip.style.left = Math.max(gap, Math.min(maxLeft, r.left + (r.width - t.width) / 2)) + "px";
    };

    document.addEventListener("pointerover", (e) => {
      const el = e.pointerType !== "touch" && triggerAt(e.target);
      if (!el || el === trigger) return;
      clearTimeout(timer);
      timer = setTimeout(() => show(el), 200);
    });
    document.addEventListener("pointerout", (e) => {
      const el = e.target.closest?.("[data-tooltip]");
      if (el && !el.contains(e.relatedTarget)) el === trigger ? hide() : clearTimeout(timer);
    });
    document.addEventListener("focusin", (e) => {
      const el = triggerAt(e.target);
      if (el) show(el);
    });
    document.addEventListener("focusout", (e) => {
      if (trigger?.contains(e.target) && !trigger.contains(e.relatedTarget)) hide();
    });
    // A tap shows it (touch has no hover); a click elsewhere, Escape or scrolling hides it.
    document.addEventListener("click", (e) => {
      const el = triggerAt(e.target);
      el ? show(el) : hide();
    });
    document.addEventListener("keydown", (e) => e.key === "Escape" && hide());
    document.addEventListener("scroll", hide, { capture: true, passive: true });
  }

  /**
   * Folds `<details data-collapse="<breakpoint>">` from that breakpoint through the next one, on load and when
   * the viewport enters or leaves that range. On leaving it reopens only what it folded itself
   * (`data-collapsed`): what the user closed stays closed. Once the user opens a folded one, it is theirs.
   * A `<details>` holding the URL's #target stays open: the browser opened it to reveal the target.
   */
  const collapse = {
    // The names of `$breakpoints` in order; their widths are the `--f-breakpoint-<name>` tokens.
    breakpoints: ["small", "medium", "large", "xlarge", "xxlarge"],
    /** @type {Object<string, ?MediaQueryList>} */
    queries: {},
    /** @type {WeakMap<HTMLDetailsElement, boolean>} Whether update() last folded it, so it acts only on a change. */
    folded: new WeakMap(),

    /**
     * The range a breakpoint folds in, created once and watched for changes.
     * @param {string} name A breakpoint name.
     * @return {?MediaQueryList} Null for the last breakpoint or an unknown name.
     */
    query(name) {
      if (!(name in collapse.queries)) {
        const i = collapse.breakpoints.indexOf(name);
        const width = (bp) =>
          getComputedStyle(document.documentElement).getPropertyValue(`--f-breakpoint-${bp}`).trim();
        const end = collapse.breakpoints[i + 2];
        const query =
          i < 0 || i === collapse.breakpoints.length - 1
            ? null
            : window.matchMedia(`(width >= ${width(name)})` + (end ? ` and (width < ${width(end)})` : ""));
        query?.addEventListener("change", collapse.update);
        collapse.queries[name] = query;
      }
      return collapse.queries[name];
    },

    /** @return {void} */
    update() {
      const target = document.querySelector(":target");
      document.querySelectorAll("details[data-collapse]").forEach((details) => {
        const fold = !!collapse.query(details.dataset.collapse)?.matches;
        if (collapse.folded.get(details) === fold) return;
        collapse.folded.set(details, fold);
        if (fold && details.open && !details.contains(target)) {
          details.open = false;
          details.dataset.collapsed = "";
        } else if (!fold && "collapsed" in details.dataset) {
          details.open = true;
          delete details.dataset.collapsed;
        }
      });
    },
  };
  document.addEventListener(
    "toggle",
    (e) => {
      if (e.target.open) delete e.target.dataset?.collapsed;
    },
    true,
  );
  ready(collapse.update);
})();
