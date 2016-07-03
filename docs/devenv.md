**NB This is only useful if you plan on developing the extension. You don't need to follow these instructions if you only want to use the extension in Chrome.**

# Setting up a development environment

Follow the [basic steps](https://developer.chrome.com/extensions/getstarted#unpacked) to add this extension in Developer mode.

### Enabling auto-reloading the extension in Chrome on any code change

Install [homebrew](http://brew.sh/), then:

    brew tap Homebrew/bundle

`cd` into repo directory, then...

    brew bundle

Make sure that [Node](https://nodejs.org/en/) is installed, then run

    npm update

Next, install the [Extensions Reloader](https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid) Chrome extension.

Finally, to start the gulp-based file change watcher, run

    gulp