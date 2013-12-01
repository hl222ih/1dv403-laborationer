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
        that = this,
        tempAttribute;

    for (count = 0; count < existingMessageBoardNodes.length; count++) {
        tempAttribute = existingMessageBoardNodes[count].getAttribute("class");
        if (!/invisible/.test(tempAttribute)) {
            existingMessageBoardNodes[count].setAttribute("class", tempAttribute + " invisible");
        }
        //existingMessageBoardNodes[count].setAttribute("class", tempAttribute ? tempAttribute + " invisible" : "invisible");
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
    var send;

    send = function (e) {
        var message,
            buttons,
            removeButton,
            timeButton;

        if (textArea.value.trim() !== "") {
            message = new Message(textArea.value, new Date());

            that.messages.push(message);
            document.getElementById("numberOfMessages").innerHTML = that.messages.length.toString();
            buttons = message.render(e);
            timeButton = buttons[0];
            removeButton = buttons[1];

            removeButton.addEventListener('click', function (e) {
                //kontrollera först att användaren verkligen vill ta bort.
                var nodeToRemove = e.target.parentNode.parentNode,
                    parentNodeToRemoveFrom = nodeToRemove.parentNode,
                    index = 0,  //för att räkna ut meddelandets position
                    node = nodeToRemove;  //för att räkna ut meddelandets position

                if (window.confirm("Vill du verkligen radera meddelandet?")) {
                    while (node.previousElementSibling !== null) {
                        node = node.previousElementSibling;
                        index++;
                    }
                    parentNodeToRemoveFrom.removeChild(nodeToRemove);
                    that.messages.splice(index, 1);
                    document.getElementById("numberOfMessages").innerHTML = that.messages.length.toString();
                    textArea.focus();
                }
            }, false);

            timeButton.addEventListener('click', function (e) {
                var node = e.target.parentNode.parentNode,
                    index = 0;

                while (node.previousElementSibling !== null) {
                    index++;
                }

                window.alert("Meddelandet skickades " + that.messages[index].getDateTimeText() + ".");

            }, false);

            textArea.value = "";
        }

        textArea.focus();

    };

    textArea.addEventListener('keydown', function (e) {
        if (e.keyCode === 13 && e.shiftKey !== true) {
            send(e);
            e.preventDefault(); //så inte en radbrytning läggs till i meddelanderutan efter det att meddelandet skickats.
        }
    }, false);
    sendButton.addEventListener('click', function (e) {
        send(e);
    }, false);

};