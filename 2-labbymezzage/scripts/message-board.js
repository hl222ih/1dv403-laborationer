/*global Message*/

/**
 *
 * @constructor En meddelandehanterare.
 */
function MessageBoard() {
    "use strict";
    var sendButton = document.getElementsByClassName("send")[0],
        inputArea = document.getElementsByClassName("input")[0],
        textArea = inputArea.getElementsByTagName("textarea")[0],
        message,
        that = this;

    this.messages = [];
    this.button = sendButton;
    sendButton.addEventListener('click', function (e) {
        that.messages.push(new Message(textArea.value, new Date()));
        that.messages[that.messages.length - 1].render(e);
        textArea.value = "";
        textArea.focus();
    }, false);

}