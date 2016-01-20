GMDE = window.GMDE || {};

GMDE.CogButtonView = Backbone.View.extend({
	tagName: 'div',
	className: 'gmde_cog',

	initialize: function(opts) {
		_.bindAll(this, 'clickHandler');
		this.gmail = opts.gmail;
		this.composeObj = opts.composeObj;
		this.render();
	},
	render: function() {
		var that = this;

		this.$el.attr('title', 'Dictation language');
		this.gmail.tools.add_compose_button(
			this.composeObj, this.el, this.clickHandler);
		// set css rules on the parent to make this button look proper
		this.$el.parent().addClass('gmde_cog_parent');

		this.$langMenu = $("<div>", {
			'class': 'gmde_lang_menu'
		}).hide().appendTo('body');

		this.$langMenuOverlay = $("<div>", {
			'class': 'gmde_lang_menu_overlay'
		}).hide().appendTo('body').click(function() {
			$(this).hide();
			that.$langMenu.hide();
		});;

		this.setupLangMenu();
	},
	remove: function() {
		this.$langMenu.remove();
		this.$langMenuOverlay.remove();

		Backbone.View.prototype.remove.call(this);
	},
	clickHandler: function() {
		this.$langMenuOverlay.toggle();
		this.$langMenu.css({
			top: this.$el.parent().offset().top - 260,
			left: this.$el.parent().offset().left
		}).toggle();
	},
	langClickHandler: function(lang) {
		this.$langMenu.hide();
		this.$langMenuOverlay.hide();

		this.trigger('setLang', lang);
	},
	setupLangMenu: function() {
		var that = this;
		var allLangs = [];

		GMDE.Utils.LANGS.forEach(function(l) {
			if(l.length == 2) {
				allLangs.push([l[0], l[1][0]]);
			} else {
				l.forEach(function(ll, llidx) {
					if(llidx === 0) {
						return;
					}
					allLangs.push([l[0] +" ("+ ll[1] +")", ll[0]]);
				});
			}
		});

		allLangs.forEach(function(l) {
			var $l = $("<div>", {
				html: l[0],
				'class': 'lang'
			}).click(function() {
				$(this).siblings().removeClass('active');
				$(this).addClass('active');

				that.langClickHandler(l[1]);
			}).appendTo(that.$langMenu);

			if(l[1] === GMDE.Utils.defaultLang) {
				$l.addClass('active');
			}
		});
	}
});