/**
 * todo self host the fonts: https://google-webfonts-helper.herokuapp.com/
 */

!(function (window, document, $) {
  // jQuery's slides (Foundation's accordion menu, the tabs below) are not CSS, so the reduced-motion rule misses them.
  var reduced_motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  $.fx.off = reduced_motion.matches;
  reduced_motion.addEventListener("change", function (e) {
    $.fx.off = e.matches;
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

  $(function () {
    update_collapse();
    $(window).on("changed.zf.mediaquery", update_collapse);
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
    var queries = Foundation.MediaQuery.queries;
    var target = document.querySelector(":target");

    $("details[data-collapse]").each(function () {
      var breakpoint = this.getAttribute("data-collapse");
      var next = queries[queries.findIndex((element) => element.name == breakpoint) + 1];
      var fold = !!next && Foundation.MediaQuery.atLeast(breakpoint) && Foundation.MediaQuery.upTo(next.name);
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
})(window, document, jQuery);
