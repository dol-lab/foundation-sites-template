/**
 * todo self host the fonts: https://google-webfonts-helper.herokuapp.com/
 */

!(function (window, document, $) {
  // Script animations (jQuery's slides in Foundation's accordion menu, the tab panels below) are not CSS, so the
  // reduced-motion rule misses them. Read per animation, it follows both the device and a `data-motion` setting on <html> (see _motion.scss).
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  /** @return {boolean} Whether animations should jump to their end. */
  const motionOff = () => {
    const setting = document.documentElement.dataset.motion;
    return setting === "reduce" || (setting !== "full" && reducedMotion.matches);
  };
  Object.defineProperty($.fx, "off", { configurable: true, get: motionOff });

  /**
   * Tabs: `.tabs[data-tabs]` with an id, whose `.tabs-title` links name their `.tabs-panel` by `href="#id"` or
   * `data-tabs-target`. Delegated; init (on DOM ready, or the first click for a later one) adds the ARIA roles
   * and `hidden` and selects the tab the URL's #hash names (also on `hashchange`). Arrow keys move between titles.
   * The server marks the initial title and panel `.is-active`, or `data-link-active-class`/`data-panel-active-class`
   * (a tab bar in a Foundation dropdown menu: it strips `li.is-active` on close). `data-active-collapse`: the active
   * tab's title closes it. `data-deep-link`: a change writes the panel's id to the URL. `data-transition`: the
   * panels' box eases to its new height. A change fires a bubbling `tabchange` on the `.tabs`,
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
    if (!step) return;
    const titles = [...title.parentElement.children].filter((t) => t.matches(".tabs-title") && tabs.link(t));
    const next = titles[(titles.indexOf(title) + step + titles.length) % titles.length];
    if (!next || next === title) return;
    e.preventDefault();
    tabs.link(next).focus();
    tabs.select(next);
  });
  window.addEventListener("hashchange", tabs.fromHash);
  $(function () {
    document.querySelectorAll(".tabs[data-tabs]").forEach(tabs.init);
    tabs.fromHash();
  });

  /**
   * Find-in-page opens a dropdown menu's submenu. A closed one is `hidden="until-found"`: the browser
   * searches it and, on a match, removes the attribute and fires `beforematch`, where Foundation opens it.
   * Without support, `until-found` is plain `hidden`, which the submenu's CSS would override: skip it then.
   * A consumer's handler on Foundation's show/hide must not return false: jQuery would stop the event this syncs on.
   */
  if ("onbeforematch" in document.documentElement) {
    $(document).on("init.zf.dropdown-menu show.zf.dropdownMenu hide.zf.dropdownMenu", function (e) {
      // Not jQuery's attr(): `hidden` is a boolean attribute to it, written as hidden="hidden".
      $(e.target)
        .closest("[data-dropdown-menu]")
        .find(".is-dropdown-submenu")
        .each(function () {
          this.classList.contains("js-dropdown-active")
            ? this.removeAttribute("hidden")
            : this.setAttribute("hidden", "until-found");
        });
    });
    document.addEventListener("beforematch", function (e) {
      var $sub = $(e.target).filter(".is-dropdown-submenu");
      $sub.closest("[data-dropdown-menu]").foundation("_show", $sub);
    });
  }

  // A `[data-close]` button removes its `[data-closable]` box (a reveal's `data-close` still goes to Foundation).
  document.addEventListener("click", function (e) {
    e.target.closest("[data-close]")?.closest("[data-closable]")?.remove();
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

  $(function () {
    update_collapse();
  });
  // Once the user opens a folded disclosure, it is theirs: the next unfold leaves it as they left it.
  document.addEventListener(
    "toggle",
    function (e) {
      if (e.target.open) {
        e.target.removeAttribute("data-collapsed");
      }
    },
    true,
  );
  /**
   * Folds `[data-collapse="<breakpoint>"]` `<details>` from that breakpoint through the next one. Acts on load and when the viewport enters or leaves
   * that range; on leaving it reopens only what it folded itself (`data-collapsed`), so what the
   * user closed stays closed and what they opened stays open.
   *
   * A `<details>` holding the URL's #target stays open: the browser opened it to reveal the
   * target, and that is the reason for the visit.
   */
  function update_collapse() {
    var target = document.querySelector(":target");

    $("details[data-collapse]").each(function () {
      var fold = !!fold_query(this.getAttribute("data-collapse"))?.matches;
      if ($(this).data("folded") === fold) {
        return;
      }
      $(this).data("folded", fold);

      if (fold && this.open && !(target && this.contains(target))) {
        this.open = false;
        this.setAttribute("data-collapsed", "");
      } else if (!fold && this.hasAttribute("data-collapsed")) {
        this.open = true;
        this.removeAttribute("data-collapsed");
      }
    });
  }

  // The names of `$breakpoints` in order; their widths are the `--f-breakpoint-<name>` tokens.
  var breakpoints = ["small", "medium", "large", "xlarge", "xxlarge"];
  var fold_queries = {};

  /**
   * The range a `data-collapse` breakpoint folds in, created once and watched for changes.
   * @param {string} name A breakpoint name.
   * @return {?MediaQueryList} Null for the last breakpoint or an unknown name.
   */
  function fold_query(name) {
    if (!(name in fold_queries)) {
      var i = breakpoints.indexOf(name);
      var width = (bp) =>
        getComputedStyle(document.documentElement)
          .getPropertyValue("--f-breakpoint-" + bp)
          .trim();
      var end = breakpoints[i + 2];
      fold_queries[name] =
        i < 0 || i === breakpoints.length - 1
          ? null
          : window.matchMedia(`(width >= ${width(name)})` + (end ? ` and (width < ${width(end)})` : ""));
      fold_queries[name]?.addEventListener("change", update_collapse);
    }
    return fold_queries[name];
  }
})(window, document, jQuery);
