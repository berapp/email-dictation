SCRIPTS = [
  "src/lib/jquery-1.12.0.min.js",
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
  s.src = chrome.extension.getURL(scriptName);
  s.onreadystatechange = s.onload = function() {
    var state = s.readyState;
    if (!state || /loaded|complete/.test(state)) {
      callback();
    }
  };
  document.documentElement.appendChild(s);
}

loadOneScript();