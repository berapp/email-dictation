GMDE = window.GMDE || {};

GMDE.MicButtonView = Backbone.View.extend({
	tagName: 'div',
	className: 'gmde_microphone',

	initialize: function(opts) {
		_.bindAll(this, 'clickHandler');
		this.gmail = opts.gmail;
		this.composeObj = opts.composeObj;
		this.dictationObj = opts.dictationObj;
		this.listenTo(this.dictationObj, 'end', this.dictationEnded);

		this.isDictationRunning = false;
		this.render();
	},
	render: function() {
		this.$el.attr('title', 'Gmail dictation');
		this.gmail.tools.add_compose_button(
			this.composeObj, this.el, this.clickHandler);
		// set css rules on the parent to make this button look dapper
		this.$el.parent().addClass('gmde_microphone_parent');
	},
	clickHandler: function() {
		this.isDictationRunning = !(this.isDictationRunning);

		this.$el.toggleClass('active', this.isDictationRunning);

		if(this.isDictationRunning) {
			this.dictationObj.start();
		} else {
			this.dictationObj.stop();
			this.$el.removeClass('processing');
		}

		this.trigger('click');
	},
	showProcessingFeedback: function(doShow) {
		this.$el.toggleClass('processing', doShow);
	},
	dictationEnded: function() {
		// user stopped talking for more than 12 seconds
		// or dictation started in another compose window
		this.isDictationRunning = false;
		this.$el.removeClass('active');
		this.$el.removeClass('processing');
	}
});