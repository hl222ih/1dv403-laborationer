/*global Message*/

var messageBoard;

function displayMessage(message) {
    "use strict";
    window.alert(message);
}

function messageBoard() {
    "use strict";
    var inputArea = document.getElementById("input"),
        textArea = inputArea.getElementsByTagName("textarea")[0],
        sendButton = document.getElementById("send"),
        message = new Message("text", new Date());

    sendButton.onclick = function () {
        displayMessage(message.getDateTimeText());
    };
}

window.onload = messageBoard;
