/*global MessageBoard*/

window.onload = function () {
    "use strict";
    var messageBoards = [],
        messageBoardNavigator = document.getElementsByTagName("aside")[0],
        newMessageBoardButton = document.getElementsByTagName("button")[0];

    newMessageBoardButton.addEventListener("click", function (e) {
        var container = document.getElementById("container"),
            messageBoardButton = document.createElement("button"),
            numberOfMessageBoards = messageBoardNavigator.childElementCount - 1, // -1 eftersom vi inte räknar med "newMessageBoard"
            currentMessageBoard;

        messageBoards.push(new MessageBoard()); //skapar ny messageBoard
        document.getElementById("numberOfMessages").innerHTML = messageBoards[messageBoards.length - 1].messages.length.toString();

        messageBoardButton.setAttribute("id", (numberOfMessageBoards + 1).toString());
        messageBoardButton.innerHTML = "Messageboard #" + (numberOfMessageBoards + 1);
        messageBoardNavigator.appendChild(messageBoardButton);

        messageBoardButton.addEventListener("click", function (e) {
            var existingMessageBoardNodes = document.getElementsByClassName("messageBoard"),
                count = 0;

            for (count = 0; count < existingMessageBoardNodes.length; count++) {
                existingMessageBoardNodes[count].setAttribute("style", "display:none;");
            }
            currentMessageBoard = existingMessageBoardNodes[parseInt(e.target.getAttribute("id"), 10)]
            currentMessageBoard.removeAttribute("style");
            document.getElementById("numberOfMessages").innerHTML = messageBoards[parseInt(e.target.getAttribute("id"), 10) - 1].messages.length.toString();
            currentMessageBoard.scrollTop = currentMessageBoard.scrollHeight; //så att när man skiftar messageBoard, så scrollas det ner så att det senast tillagda meddelandet syns.
        });
    });

};
