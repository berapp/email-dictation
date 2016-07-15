SCRIPTS = [
  "src/lib/jquery-2.2.4.min.js",
  "src/lib/underscore-min.js",
  "src/lib/backbone-min.js",
  "src/lib/gmail.min.js",

  "src/js/app.js",
  "src/js/dictation.js",
  "src/js/utils.js",
  "src/js/views/micbuttonview.js",
  "src/js/views/cogbuttonview.js",
  "src/js/views/composeview.js",
  "src/js/boot.js"
];

var savedOptions = {};

// load scripts in order defined above --
// script-load order is otherwise undefined.
// among others, this impacts backbone, which requires
// underscore & jquery to be loaded first.
function loadOneScript() {
  if (SCRIPTS.length === 0) {
    return;
  }
  var script = SCRIPTS.shift();
  loadScript(script, loadOneScript);
}

function loadScript(scriptName, callback) {
  var s = document.createElement("script");
  s.async = false;
  // pass options to every script as data-options attribute
  // FIXME could/should only pass options to app.js or to
  // specific options.js file
  s.dataset.options = JSON.stringify(savedOptions);
  s.dataset.runtimeId = JSON.stringify(chrome.runtime.id);
  s.onreadystatechange = s.onload = function() {
    var state = s.readyState;
    if (!state || /loaded|complete/.test(state)) {
      callback();
    }
  };
  s.src = chrome.extension.getURL(scriptName);
  document.documentElement.appendChild(s);
}

chrome.storage.sync.get("GMDE_options", function (opts) {
  savedOptions = opts.GMDE_options ||  {};
  // got extension options, can start loading scripts
  loadOneScript();
});
