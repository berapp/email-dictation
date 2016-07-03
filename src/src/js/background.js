chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    chrome.storage.sync.get("GMDE_options", function (opts) {
      console.log('background');
      console.log('opts', opts);
      console.log('request', request);
      var GMDE_options = opts.GMDE_options || {};
      GMDE_options.lang = request.lang;
      console.log('GMDE_options', GMDE_options);
      chrome.storage.sync.set({GMDE_options: GMDE_options});
    });
});