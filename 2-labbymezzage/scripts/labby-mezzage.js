/*global MessageBoard*/

window.onload = function () {
    "use strict";
    var messageBoards = [],
        messageBoardNavigator = document.getElementsByTagName("aside")[0],
        newMessageBoardButton = document.getElementsByTagName("button")[0];

    newMessageBoardButton.addEventListener("click", function (e) {
        var container = document.getElementById("container"),
            messageBoardButton = document.createElement("button"),
            numberOfMessageBoards = messageBoardNavigator.childElementCount - 1, // -1 eftersom inte räknar med "newMessageBoard"
            clearAndRenderNewMessageBoard;

        messageBoards.push(new MessageBoard()); //skapar ny messageBoard

        messageBoardButton.setAttribute("id", "MessageBoard" + (numberOfMessageBoards + 1));
        messageBoardButton.innerHTML = "Messageboard #" + (numberOfMessageBoards + 1);
        messageBoardNavigator.appendChild(messageBoardButton);

        clearAndRenderNewMessageBoard = function (e) {
            var messageBoardNode = document.createElement("div"),
                input = document.createElement("div"),
                textArea = document.createElement("textarea"),
                sendButton = document.createElement("sendButton"),
                existingMessageBoardNode = document.getElementsByClassName("messageBoard")[0];

            if (existingMessageBoardNode !== null) {
                container.removeChild(existingMessageBoardNode);
            }

            messageBoardNode.setAttribute("class", "messageBoardNode");
            input.setAttribute("class", "input");
            textArea.setAttribute("autofocus", "autofocus");
            textArea.setAttribute("wrap", "soft");
            textArea.setAttribute("placeholder", "Skriv någonting och tryck på ENTER för att skicka...");
            sendButton.setAttribute("class", "send");

            input.appendChild(textArea);
            input.appendChild(sendButton);
            messageBoardNode.appendChild(textArea);

            var index = 0;
            var node = e.target;
            while (node.previousElementSibling !== null) {
                node = node.previousElementSibling;
                index++;
            }
            if (index !== 0) {
               // messageBoards[index].renderMessages();  avaktiverar denna tillfälligt för att testa koden
            }
        };

        messageBoardButton.addEventListener("click", clearAndRenderNewMessageBoard(e), false);
        //clearAndRenderNewMessageBoard(e);

    });

};
