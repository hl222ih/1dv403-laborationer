/*global Message*/

/**
 *
 * @constructor En meddelandehanterare.
 */
function MessageBoard() {
    "use strict";
    var sendButton,
        textArea;

    this.messages = [];
    this.render();
}

MessageBoard.prototype.render = function () {
    "use strict";
    var container = document.getElementById("container"),
        messageBoardNode = document.createElement("div"),
        content = document.createElement("div"),
        input = document.createElement("div"),
        textArea = document.createElement("textarea"),
        sendButton = document.createElement("button"),
        existingMessageBoardNodes = document.getElementsByClassName("messageBoard"),
        count = 0,
        that = this;

    for (count = 0; count < existingMessageBoardNodes.length; count++) {
        existingMessageBoardNodes[count].setAttribute("style", "display:none;");
    }


    messageBoardNode.setAttribute("class", "messageBoard");
    content.setAttribute("class", "content");
    input.setAttribute("class", "input");
    textArea.setAttribute("autofocus", "autofocus");
    textArea.setAttribute("wrap", "soft");
    textArea.setAttribute("placeholder", "Skriv någonting och tryck på ENTER för att skicka...");
    sendButton.setAttribute("class", "send");
    sendButton.innerHTML = "SKICKA";

    input.appendChild(textArea);
    input.appendChild(sendButton);
    messageBoardNode.appendChild(content);
    messageBoardNode.appendChild(input);
    var footer = container.lastElementChild;
    container.removeChild(footer);
    container.appendChild(messageBoardNode);
    container.appendChild(footer);

    sendButton.addEventListener('click', function (e) {
        var message;

        if (textArea.value !== "") {
            message = new Message(textArea.value, new Date());

            that.messages.push(message);
            message.render(e);
            textArea.value = "";
        }

        textArea.focus();

    }, false);

};