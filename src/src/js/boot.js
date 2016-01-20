(function() {
	var bootCheckInterval = setInterval(function() {
		if(document.readyState === "complete" && typeof Gmail !== "undefined") {
			clearInterval(bootCheckInterval);

			$(function() {			
				GMDE.app = new GMDE.App();
				GMDE.app.initialize();
			});
		}
	});
})();