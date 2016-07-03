GMDE = window.GMDE || {};

// not a view per se -- this exists to help us 
// track the buttons & dictation object for this
// particular compose window
GMDE.ComposeView = Backbone.View.extend({
	initialize: function(opts) {
		_.bindAll(this, 'dictationResultCallback');
		this.composeObj = opts.composeObj;
		this.gmail = opts.gmail;

		this.$currDictationEl = null;
		this.$lastDictationEl = null;

		this.render();
	},
	render: function() {
		var that = this;

		this.dictationObj = new GMDE.Dictation();
		// setup handler
		this.dictationObj.on('result', this.dictationResultCallback);
		this.dictationObj.initialize({
			lang: GMDE.app.getLang(),
		});
		// mic button view is responsible for starting/stopping dictation obj
		// also: mic button view will add itself to the compose window
		this.micButton = new GMDE.MicButtonView({
			composeObj: this.composeObj,
			dictationObj: this.dictationObj,
			gmail: this.gmail
		});
		this.micButton.on('click', function() {
			// when mic button is clicked, we can at this point
			// reliably consider that the compose window has been
			// fully loaded & open. store reference to that
			// compose window's body el
			that.$composeBodyEl = that.composeObj.dom('body');

			// re-initialize references -- this allows users to start dictation
			// end dictation (while it isn't done getting final results) and re-starting
			// a new dictation that will not interefere with the previous one.
			this.$currDictationEl = null;
		});

		this.cogButton = new GMDE.CogButtonView({
			composeObj: this.composeObj,
			gmail: this.gmail
		});
		this.cogButton.on('setLang', function(lang) {
			that.dictationObj.setLang(lang);
		});

		this.$separatorButton = $(document.createTextNode(" "));
		this.gmail.tools.add_compose_button(this.composeObj, this.$separatorButton);
		this.$separatorButton.parent().addClass('gmde_separator_parent');
	},
	remove: function() {
		this.dictationObj.abort();
		this.micButton.remove();
		this.cogButton.remove();
		this.$separatorButton.remove();
		Backbone.View.prototype.remove.call(this);
	},
	dictationResultCallback: function(res) {
		// the large code below (this method & createNodeAtCaret) deals with different situations:
		// first, with the caret being inside or outside of the message body element upon dictation results
		// then, we need to deal with different situations when the caret is placed mid-node
		// and to deal differently with textnodes and 'regular' dom node (e.g., span elements)

		// if any text is selected, remove it
		if(window.getSelection().type === "Range") {
			window.getSelection().getRangeAt(0).deleteContents();
		}

		res.transcript = this.transcriptPostProcess(res.transcript);

		this.micButton.showProcessingFeedback(!res.isFinal);

		// element is detached -- it could have been removed by the user while editing
		if(this.$composeBodyEl.has(this.$currDictationEl).length === 0) {
			this.$currDictationEl = null;
		}
		if(this.$composeBodyEl.has(this.$lastDictationEl).length === 0) {
			this.$lastDictationEl = null;
		}

		var $selectionNode = $(window.getSelection().anchorNode);

		if(this.$composeBodyEl.is($selectionNode) ||
			this.$composeBodyEl.has($selectionNode).length > 0) {
			// caret is within compose body el
			if(!this.$currDictationEl) {
				this.$currDictationEl = this.createNodeAtCaret();
			}
			this.$currDictationEl.html(res.transcript)

			this.placeCaretAfterTranscript();

			if(res.isFinal) {
				this.$lastDictationEl = this.$currDictationEl;
				this.$currDictationEl = null;
			}
		} else {
			// caret is outside of compose body el

			// the very first time we receive a dictation
			// transcript, prepend a new dictationEl
			// to the body so that the result is 'top-posted'.
			// then, insert new dictationEls right after previous
			// dictationEls.
			if(this.$lastDictationEl === null) {
				var $el = $("<span>").prependTo(this.$composeBodyEl);
				this.$lastDictationEl = this.$currDictationEl = $el;
			}
			if(this.$currDictationEl === null) {
				var $el = $("<span>").insertAfter(this.$lastDictationEl);
				this.$currDictationEl = $el;
			}

			this.$currDictationEl.html(res.transcript);

			this.placeCaretAfterTranscript();

			if(res.isFinal) {
				this.$currDictationEl = null;
			}
		}
	},
	createNodeAtCaret: function() {
		var $selectionNode = $(window.getSelection().anchorNode);

		if(this.$composeBodyEl.is($selectionNode)) {
			// empty body, create span there.
			if(this.$composeBodyEl.text().length === 0) {
				return $("<span>").appendTo(this.$composeBodyEl);
			} else {
				if(this.$lastDictationEl && window.getSelection().anchorOffset > 0) {
					// caret is in root body element -- new span should go after last dictation span, if it exists
					return $("<span>").insertAfter(this.$lastDictationEl);
				} else {
					// user has started replying to an email, prepend new span to the body
					return $("<span>").prependTo(this.$composeBodyEl);
				}
			}
		}

		if($(window.getSelection().anchorNode).text().length) {
			// is selection at the very end of the node?
			// if this is a text node, are we also inside the last text node of the parent?
			if($(window.getSelection().anchorNode).text().length === window.getSelection().anchorOffset &&
				(window.getSelection().anchorNode.nodeType !== 3 || (window.getSelection().anchorNode.nodeType === 3 && 
																	window.getSelection().anchorNode.nextElementSibling === null ))) {
				if(window.getSelection().anchorNode.nodeType === 3) {
					// insert after textnode's parent, i.e. the span that contains it
					return $("<span>").insertAfter(
						$(window.getSelection().anchorNode).parent());
				} else {
					// place new node after previous node.
					return $("<span>").insertAfter(
						$(window.getSelection().anchorNode));
				}
			} else {			
				// break text at caret, creating 2 new text nodes
				var n1 = window.getSelection().anchorNode;
				var n2 = window.getSelection().anchorNode.splitText(
					window.getSelection().anchorOffset);

				// create spans which will replace text nodes
				var $n1 = $("<span>", {html: $(n1).text()});
				var $n2 = $("<span>", {html: $(n2).text()});

				var $parent = $(window.getSelection().anchorNode);

				$n1.insertAfter($parent);
				var $newSpan = $("<span>").insertAfter($n1);
				$n2.insertAfter($newSpan);

				$parent.remove();

				if($parent[0].nodeType === 3) {
					$(n2).remove();
				}

				return $newSpan;
			}
		} else {
			// when caret in empty <span>, get rid of preceeding <br>
			$(window.getSelection().anchorNode).html('');
			return $("<span>").insertAfter(
				window.getSelection().anchorNode);
		}
	},
	placeCaretAfterTranscript: function() {
		var range = document.createRange();
		range.setStartAfter(this.$currDictationEl[0]);
		range.collapse(true);

		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	},
	transcriptPostProcess: function(t) {
		// convert "New Paragraph" into that very thing.
		return t.replace(/[\r\n]+/g, '<br><br>');
	}
});