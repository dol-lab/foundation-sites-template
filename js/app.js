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
   * Tooltips: hovering, focusing or tapping a `[data-tooltip]` shows its `title` in one shared popover.
   * Delegated, so markup added later needs no init. On first contact the `title` moves to `data-tooltip`
   * (and `aria-description`), so the browser's own tooltip does not show as well. Without popover
   * support nothing moves and the browser's tooltip stays.
   */
  if ("showPopover" in HTMLElement.prototype) {
    const tip = document.createElement("div");
    tip.className = "tooltip";
    tip.popover = "manual";
    tip.setAttribute("aria-hidden", "true");
    let trigger = null;
    let timer = 0;

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
      return el?.dataset.tooltip ? el : null;
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
      tip.textContent = el.dataset.tooltip;
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
