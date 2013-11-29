/*global Message*/

/**
 *
 * @constructor En meddelandehanterare.
 */
function MessageBoard() {
    "use strict";
    var inputArea = document.getElementsByClassName("input")[0],
        textArea = inputArea.getElementsByTagName("textarea")[0],
        sendButton = document.getElementsByClassName("send")[0],
        message;

    this.button = sendButton;
    sendButton.addEventListener('click', function (e) {
        message = new Message("text", new Date());
        message.render();
    }, false);

}


