/**
 * todo self host the fonts: https://google-webfonts-helper.herokuapp.com/
 */

!function (window, document, $) {
	$(function () {
		$('.tabs[data-transition]').map(function () {
			var el = $(`.tabs-content[data-tabs-content=${this.id}]`);
			el.attr('data-transition', true);
			el.find('.tabs-panel.is-active').show();
			el.find('.tabs-panel.is-active-tab').show();
		});
	});
	$(document).on('click', '.tabs[data-transition] .tabs-title a', function () {
		var tab_id = $(this).attr('href') ? $(this).attr('href') : ($(this).attr('data-tabs-target') ? '#' + $(this).attr('data-tabs-target') : '');
		var tabs_id = $(this).parents('.tabs').attr('id');
		var tabs_title = $(this).parents('.tabs-title');
		var tabs_content = $(`.tabs-content[data-tabs-content=${tabs_id}]`);
		if (tabs_title.hasClass('is-active') || tabs_title.hasClass('is-active-tab')) {
			tabs_content.find(`.tabs-panel:not(${tab_id})`).slideUp(250, 'swing');
			tabs_content.find(`.tabs-panel${tab_id}`).slideDown(250, 'swing');
		} else {
			tabs_content.find(`.tabs-panel${tab_id}`).slideUp(250, 'swing');
		}
	});


	$(function () {
		update_accordion_collapse();
	});
	/**
	 * Closes `[data-collapse="<breakpoint>"]` disclosures from that breakpoint up to the next one:
	 * a `<details>` or a Foundation `.accordion`.
	 *
	 * A `<details>` holding the URL's #target stays open: the browser opened it to reveal the
	 * target, and that is the reason for the visit.
	 */
	function update_accordion_collapse() {
		var queries = Foundation.MediaQuery.queries;
		var target = document.querySelector(':target');

		$('[data-collapse]').each(function () {
			var breakpoint = this.getAttribute('data-collapse');
			var next = queries[queries.findIndex(element => element.name == breakpoint) + 1];
			if (!next || !Foundation.MediaQuery.atLeast(breakpoint) || !Foundation.MediaQuery.upTo(next.name)) {
				return;
			}

			if (this.matches('details')) {
				if (!(target && this.contains(target))) {
					this.open = false;
				}
			} else if (this.matches('.accordion')) {
				$(this).find('.accordion-item').removeClass('is-active');
				$(this).find('.accordion-content').slideUp();
			}
		});
	}
}(window, document, jQuery);
