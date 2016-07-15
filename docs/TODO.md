### priority lane

- caret positioning is a mess! any way to drastically simplify `dictationResultCallback` && `createNodeAtCaret` in `composeview.js`?
 - block temporary dictation result from being edited / caret being positioned in it?

### features

- the dictation results are conflicting with the default font set in the Gmail settings. retest with rich-text emails & different default fonts
- handle no microphone / no webspeech api, etc. errors gracefully
- show live mic volume feedback
- make lang menu compatible with keyboard (to type first letters of the selected language)
- add tooltips to mic/cog buttons resembling Gmail buttons' tooltips
- compatibility with google inbox
- capitalize new sentences

### misc

- add about in cog menu with version number, contact
- translate extension to the other 31 languages supported by the Web Speech API in Chrome
- release translated versions in Chrome Web Stores
- improve screenshots / promotional tiles (look at examples on the Chrome Store)
- add welcome page which opens after extension is installed explaining how to use it (with video)
- create tutorial video (for Chrome Store & welcome page post-installation)
- list known vocal commands per language (known English commands: "new paragraph", "comma", "dot", "period", "exclamation point", "question mark")
- new gulp task on file change: auto-generate manifest.json's `web_accessible_resources`
- on auto update, add notification icon in toolbar icon and link to changes?

### hacks (resolve / get rid / unhackify)

- injection of scripts in content.js (mandatory because of Content Security Policy -- could it be prettier?)
 - can all lib & own scripts be loaded into own namespace? requirejs? something else?
- passing of options through data- attributes on all injected scripts (pick one script? boot.js?)
- manual override of jquery name in jquery minified source to ungracefully avoid conflicts (!)
- find way to not have to call Backbone.$ in own views to use "our" jquery