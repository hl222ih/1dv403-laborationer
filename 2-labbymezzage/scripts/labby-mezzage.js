/*global MessageBoard*/

window.onload = function () {
    "use strict";
    var messageBoards = [],
        messageBoardNavigator = document.getElementsByTagName("aside")[0],
        newMessageBoardButton = document.getElementsByTagName("button")[0];

    newMessageBoardButton.addEventListener("click", function (e) {
        var container = document.getElementById("container"),
            messageBoardButton = document.createElement("button"),
            numberOfMessageBoards = messageBoardNavigator.childElementCount - 1; // -1 eftersom vi inte räknar med "newMessageBoard"

        messageBoards.push(new MessageBoard()); //skapar ny messageBoard

        messageBoardButton.setAttribute("id", (numberOfMessageBoards + 1).toString());
        messageBoardButton.innerHTML = "Messageboard #" + (numberOfMessageBoards + 1);
        messageBoardNavigator.appendChild(messageBoardButton);

        messageBoardButton.addEventListener("click", function (e) {
            var existingMessageBoardNodes = document.getElementsByClassName("messageBoard"),
                count = 0;

            for (count = 0; count < existingMessageBoardNodes.length; count++) {
                existingMessageBoardNodes[count].setAttribute("style", "display:none;");
            }
            existingMessageBoardNodes[parseInt(e.target.getAttribute("id"), 10)].removeAttribute("style");
        });
    });

};
