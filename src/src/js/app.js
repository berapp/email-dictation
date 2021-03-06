GMDE = window.GMDE || {};
GMDE.App = function() {};

GMDE.options = JSON.parse(document.currentScript.dataset.options);
var _runtimeId = JSON.parse(document.currentScript.dataset.runtimeId);

_.extend(GMDE.App.prototype, Backbone.Events, {
	initialize: function(opts) {
		this.composeViews = [];

		this.gmail = new Gmail(opts.jQuery);

    // setup handler for new compose windows
    this.gmail.observe.on("compose", this.handleNewComposeWindow.bind(this));

    // handle existing compose views
    this.gmail.dom.composes().map(this.handleNewComposeWindow.bind(this));

		this.lastNumberOfComposeWindows = null;
		setInterval(this.watchComposeWindows.bind(this), 1000);
	},
  getLang: function() {
    var lang = GMDE.options.lang || GMDE.Utils.defaultLang;
    return lang;
  },
  setLang: function(lang) {
    GMDE.options.lang = lang;
    chrome.runtime.sendMessage(_runtimeId, {lang: lang});
  },
  handleNewComposeWindow: function(composeObj) {
    var composeView = new GMDE.ComposeView({
      composeObj: composeObj,
      gmail: this.gmail
    });
    this.composeViews.push(composeView);
  },
	watchComposeWindows: function() {
		var currLen = this.gmail.dom.composes().length;

		if(this.lastNumberOfComposeWindows === null ||
			currLen != this.lastNumberOfComposeWindows) {
			// the number of compose windows has changed. check that all compose views
			// that we are aware of are still visible. otherwise, remove them.

			// list all known compose window $els
			var composeWindowEls = this.gmail.dom.composes().map(function(c) {
				return c.$el;
			});

			// go over existing ComposeViews -- remove those that are not found
			// in the compose window $el list returned by gmail.js
			this.composeViews = this.composeViews.filter(function(view) {
				var foundWindowElForView = _.any(composeWindowEls, function($windowEl) {
					return view.composeObj.$el.is($windowEl);
				});

				if(!foundWindowElForView) {
					view.remove();
					return false;
				}

				return true;
			});

			this.lastNumberOfComposeWindows = currLen;
		}
	}
});