### features

- save chosen language in extension configuration
- handle no microphone / no webspeech api, etc. errors gracefully
- show live mic volume feedback
- make lang menu compatible with keyboard (to type first letters of the selected language)
- add tooltips to buttons resembling Gmail buttons' tooltips

### misc

- translate extension to the other 31 languages supported by the Web Speech API in Chrome
- release translated versions in Chrome Web Stores
- add welcome page which opens after extension is installed explaining how to use it (with video)
- create tutorial video (for Chrome Store & welcome page post-installation)
- list known vocal commands per language (known English commands: "new paragraph", "comma", "dot", "period", "exclamation point", "question mark")
- create grunt tasks:
 - on file change: generate manifest.json's `web_accessible_resources`, send extension-reload signal to Chrome. 
 - on deployment: update version number & zip