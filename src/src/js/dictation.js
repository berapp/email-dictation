GMDE = window.GMDE || {};
GMDE.Dictation = function() {};

_.extend(GMDE.Dictation.prototype, Backbone.Events, {
    initialize: function(opts) {
        _.bindAll(this, 'recognitionResultHandler', 'start', 'stop');

        this.recognition = new webkitSpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = opts.lang;

        this.recognitionRunning = false;

        var that = this;
        this.recognition.onstart = function() {
            that.trigger('start', arguments);
        }
        this.recognition.onerror = function() {
            that.trigger('error', arguments);
        }
        this.recognition.onend = function() {
            that.trigger('end', arguments);
        }
        this.recognition.onresult = this.recognitionResultHandler;
    },
    setLang: function(lang) {
        this.recognition.lang = lang;
    },
    recognitionResultHandler: function() {
        var transcript = "";
        var isFinal = false;

        for (var i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                isFinal = true;
            }
        }

        this.trigger('result', {
            isFinal: isFinal,
            transcript: transcript
        });
    },
    start: function() {
        if(this.recognitionRunning) {
            this.recognition.abort();
        }

        this.recognition.start();
        this.recognitionRunning = true;
    },
    stop: function() {
        // important to set recognitionRunning to false before calling .stop()
        // as we are checking, in the onend handler, if the recognition is still
        // supposed to be running (to check if it should be restarted)
        this.recognitionRunning = false;
        this.recognition.stop();
    },
    abort: function() {
        this.recognitionRunning = false;
        this.recognition.abort();
    }
});