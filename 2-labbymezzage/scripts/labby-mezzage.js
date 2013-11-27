
function displayMessage(message) {
    "use strict";
    window.alert(message);
}

function init() {
    "use strict";
    var inputArea = document.getElementById("input"),
        textArea = inputArea.getElementsByTagName("textarea")[0],
        sendButton = document.getElementById("send"),
        Message,
        message = new Message("text");

    sendButton.onclick = function () { displayMessage(message.text); };
}

window.onload = init;