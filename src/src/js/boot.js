(function() {
  var bootCheckInterval = setInterval(function() {
		if(document.readyState === "complete" && window.GmailDictationJQuery && typeof Gmail !== "undefined") {
			clearInterval(bootCheckInterval);

      window.Backbone.$ = window.GmailDictationJQuery;

			window.Backbone.$(function() {
				GMDE.app = new GMDE.App();
				GMDE.app.initialize({
          jQuery: window.GmailDictationJQuery
        });
			});
		}
	}, 2000);
})();