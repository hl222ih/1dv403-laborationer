/*global MessageBoard*/

/**
 * En hanterare av meddelandehanterare.
 */
window.onload = function () {
    "use strict";
    var messageBoards = [],                      //en array som innehåller alla meddelandehanterare-objekt.
        messageBoardNavigator = document.getElementsByTagName("aside")[0], //noden där meddelandehanterare-hanteraren håller till (<aside>)
        newMessageBoardButton = document.getElementsByTagName("button")[0]; //noden för knappen som används för att skapa en ny meddelandehanterare

    /**
     * Händelsehanterare för knappen som används för att skapa en ny meddelandehanterare.
     */
    newMessageBoardButton.addEventListener("click", function (e) {
        var messageBoardButton = document.createElement("button"),//en knapp-node som kopplas till den meddelandehanterare som ska skapas.
            numberOfMessageBoards = messageBoardNavigator.childElementCount - 1, // -1 eftersom vi inte räknar med "newMessageBoard"
            currentMessageBoard,//den nod med meddelandehanterare som ska vara synlig för användaren.
            tempAttribute; //för att kunna göra ändringar i elementets attribut med hänsyn till den information som redan finns i elementets attribut.

        messageBoards.push(new MessageBoard()); //skapar ny messageBoard
        document.getElementById("numberOfMessages").innerHTML = messageBoards[messageBoards.length - 1].messages.length.toString();

        messageBoardButton.setAttribute("id", (numberOfMessageBoards + 1).toString());
        messageBoardButton.innerHTML = "Messageboard #" + (numberOfMessageBoards + 1);
        messageBoardNavigator.appendChild(messageBoardButton);

        /**
         * Händelsehanterare för att göra den befintliga meddelandehanterar-noden osynlig (lägger till klassen invisible) och
         * gör istället den meddelandehanterare som motsvarar den knapp användaren klickat på blir synlig (tar bort klassen invisible)
         */
        messageBoardButton.addEventListener("click", function (e) {
            var existingMessageBoardNodes = document.getElementsByClassName("messageBoard"),//En node-lista med alla meddelandehanterare.
                count = 0, //för användning i loopar
                idNumber; //numret på den meddelandehanterare som användaren klickat på (1-indexerat)

            //Gör alla meddelandehanterare osynliga om de inte redan är det.
            for (count = 0; count < existingMessageBoardNodes.length; count++) {
                tempAttribute = existingMessageBoardNodes[count].getAttribute("class");
                if (!/invisible/.test(tempAttribute)) {
                    existingMessageBoardNodes[count].setAttribute("class", tempAttribute + " invisible");
                }
            }
            idNumber = parseInt(e.target.getAttribute("id"), 10); //ger idNumber numret på den knapp för meddelandehanterae som användaren klickat på.
            currentMessageBoard = existingMessageBoardNodes[idNumber]; //inte -1 eftersom 0 är "skapa ny"-knappen.

            //tar bort värdet "invisible" från attributet class.
            if (currentMessageBoard.hasAttribute("class")) {
                tempAttribute = currentMessageBoard.getAttribute("class");
                tempAttribute = tempAttribute.replace(/( invisible|invisible ?)/, "");
                currentMessageBoard.setAttribute("class", tempAttribute);
            }

            document.getElementById("numberOfMessages").innerHTML = messageBoards[idNumber - 1].messages.length.toString();
            currentMessageBoard.scrollTop = currentMessageBoard.scrollHeight; //så att när man skiftar messageBoard, så scrollas det ner så att det senast tillagda meddelandet syns. Verkar inte funka med IE.
        });
    });
};
