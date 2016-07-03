### issues

- attach mic icon to existing compose windows (otherwise extension sometimes does not work)
- caret positioning is a mess. any way to drastically simplify `dictationResultCallback` && `createNodeAtCaret` in `composeview.js`?
 - block temporary dictation result from being edited / caret being positioned in it?
- the dictation results are conflicting with the default font set in the Gmail settings. retest with rich-text emails & different default fonts

### features

- add hebrew (test right-to-left!)
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