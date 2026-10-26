/**
 * todo self host the fonts: https://google-webfonts-helper.herokuapp.com/
 */

!(function (window, document, $) {
  // jQuery's slides (Foundation's accordions, the tabs below) are not CSS, so the reduced-motion rule misses them.
  var reduced_motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  $.fx.off = reduced_motion.matches;
  reduced_motion.addEventListener("change", function (e) {
    $.fx.off = e.matches;
  });

  $(function () {
    $(".tabs[data-transition]").map(function () {
      var el = $(`.tabs-content[data-tabs-content=${this.id}]`);
      el.attr("data-transition", true);
      el.find(".tabs-panel.is-active").show();
      el.find(".tabs-panel.is-active-tab").show();
    });
  });
  $(document).on("click", ".tabs[data-transition] .tabs-title a", function () {
    var tab_id = $(this).attr("href")
      ? $(this).attr("href")
      : $(this).attr("data-tabs-target")
        ? "#" + $(this).attr("data-tabs-target")
        : "";
    var tabs_id = $(this).parents(".tabs").attr("id");
    var tabs_title = $(this).parents(".tabs-title");
    var tabs_content = $(`.tabs-content[data-tabs-content=${tabs_id}]`);
    if (tabs_title.hasClass("is-active") || tabs_title.hasClass("is-active-tab")) {
      tabs_content.find(`.tabs-panel:not(${tab_id})`).slideUp(250, "swing");
      tabs_content.find(`.tabs-panel${tab_id}`).slideDown(250, "swing");
    } else {
      tabs_content.find(`.tabs-panel${tab_id}`).slideUp(250, "swing");
    }
  });

  $(function () {
    update_accordion_collapse();
    $(window).on("changed.zf.mediaquery", update_accordion_collapse);
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
  $(document).on("down.zf.accordion", function (_e, $content) {
    $content.closest(".accordion-item").removeAttr("data-collapsed");
  });
  /**
   * Folds `[data-collapse="<breakpoint>"]` disclosures from that breakpoint through the next one:
   * a `<details>` or a Foundation `.accordion`. Acts on load and when the viewport enters or leaves
   * that range; on leaving it reopens only what it folded itself (`data-collapsed`), so what the
   * user closed stays closed and what they opened stays open.
   *
   * A `<details>` holding the URL's #target stays open: the browser opened it to reveal the
   * target, and that is the reason for the visit.
   */
  function update_accordion_collapse() {
    var queries = Foundation.MediaQuery.queries;
    var target = document.querySelector(":target");

    $("[data-collapse]").each(function () {
      var breakpoint = this.getAttribute("data-collapse");
      var next = queries[queries.findIndex((element) => element.name == breakpoint) + 1];
      var fold = !!next && Foundation.MediaQuery.atLeast(breakpoint) && Foundation.MediaQuery.upTo(next.name);
      if ($(this).data("folded") === fold) {
        return;
      }
      $(this).data("folded", fold);

      if (this.matches("details")) {
        if (fold && this.open && !(target && this.contains(target))) {
          this.open = false;
          this.setAttribute("data-collapsed", "");
        } else if (!fold && this.hasAttribute("data-collapsed")) {
          this.open = true;
          this.removeAttribute("data-collapsed");
        }
      } else if (this.matches(".accordion")) {
        if (fold) {
          var active = $(this).find(".accordion-item.is-active");
          active.attr("data-collapsed", "").removeClass("is-active");
          active.find(".accordion-content").slideUp();
        } else {
          var folded = $(this).find(".accordion-item[data-collapsed]");
          folded.removeAttr("data-collapsed").addClass("is-active");
          folded.find(".accordion-content").slideDown();
        }
      }
    });
  }
})(window, document, jQuery);
