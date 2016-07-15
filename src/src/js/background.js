chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    chrome.storage.sync.get("GMDE_options", function (opts) {
      var GMDE_options = opts.GMDE_options || {};
      GMDE_options.lang = request.lang;
      chrome.storage.sync.set({GMDE_options: GMDE_options});
    });
});