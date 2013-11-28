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
        message = new Message("text", new Date());

    sendButton.onclick = function () {
        displayMessage(message.getDateTimeText());
    };

}

function displayMessage(message) {
    "use strict";
    window.alert(message);
}
