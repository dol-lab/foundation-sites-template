/**
 * todo self host the fonts: https://google-webfonts-helper.herokuapp.com/
 */

!(function (window, document, $) {
  // jQuery's slides (Foundation's accordion menu, the tabs below) are not CSS, so the reduced-motion rule misses them.
  // A getter, read per animation, follows both the device and a `data-motion` setting on <html> (see _motion.scss).
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  Object.defineProperty($.fx, "off", {
    configurable: true,
    get: () => {
      const setting = document.documentElement.dataset.motion;
      return setting === "reduce" || (setting !== "full" && reducedMotion.matches);
    },
  });

  $(function () {
    $(".tabs[data-transition]").map(function () {
      var el = $(`.tabs-content[data-tabs-content=${this.id}]`);
      el.attr("data-transition", true);
      el.find(`.tabs-panel.${$(this).data("panelActiveClass") || "is-active"}`).show();
    });
  });
  // Foundation's events, not a click: keyboard (Enter, Space, arrows) and selectTab() switch tabs without one.
  // A bubbling native `change` (an input in the bar) reaches these handlers too, without the arguments.
  $(document).on("change.zf.tabs", ".tabs[data-transition]", function (_e, _$title, $panel) {
    if (!$panel) return;
    $panel.siblings(".tabs-panel").slideUp(250, "swing");
    $panel.slideDown(250, "swing");
  });
  $(document).on("collapse.zf.tabs", ".tabs[data-transition]", function (_e, $title) {
    if (!$title) return;
    $("#" + $title.find('[role="tab"]').attr("aria-controls")).slideUp(250, "swing");
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
