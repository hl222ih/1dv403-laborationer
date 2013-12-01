/*global Message*/

/**
 * @constructor En meddelandehanterare.
 */
function MessageBoard() {
    "use strict";
    var sendButton,
        textArea;

    this.messages = [];
    this.render();
}

/**
 * Skapar och skriver ut html-koden för MessageBoard.
 */
MessageBoard.prototype.render = function () {
    "use strict";
    var container = document.getElementById("container"),//html-dokumentets container-node.
        messageBoardNode = document.createElement("div"),//skapar ett node-träd för en ny meddelandehanterare.
        content = document.createElement("div"),         //...
        input = document.createElement("div"),
        textArea = document.createElement("textarea"),
        sendButton = document.createElement("button"),
        existingMessageBoardNodes = document.getElementsByClassName("messageBoard"), //en array med alla meddelarehanterare-noder.
        count,          //för användning i loopar.
        that = this,    //för användning av yttre variabler i closure
        tempAttribute,  //för att kunna göra ändringar i elementets attribut med hänsyn till den information som redan finns i elementets attribut.
        footer,         //html-dokumentets footer-node.
        send;           //funktion för att "skicka meddelande", skapar meddelandet, lägger till händelsehanterare, skriver ut det, med mera.

    for (count = 0; count < existingMessageBoardNodes.length; count++) {
        tempAttribute = existingMessageBoardNodes[count].getAttribute("class");
        if (!/invisible/.test(tempAttribute)) {
            existingMessageBoardNodes[count].setAttribute("class", tempAttribute + " invisible");
        }
    }

    //skapar attribut för de skapade elementen
    messageBoardNode.setAttribute("class", "messageBoard");
    content.setAttribute("class", "content");
    input.setAttribute("class", "input");
    textArea.setAttribute("autofocus", "autofocus");
    textArea.setAttribute("wrap", "soft");
    textArea.setAttribute("placeholder", "Skriv någonting och tryck på ENTER för att skicka...");
    sendButton.setAttribute("class", "send");
    sendButton.innerHTML = "SKICKA";

    //kopplar ihop de skapade elementen.
    input.appendChild(textArea);
    input.appendChild(sendButton);
    messageBoardNode.appendChild(content);
    messageBoardNode.appendChild(input);
    footer = container.lastElementChild;
    container.removeChild(footer);
    container.appendChild(messageBoardNode);
    container.appendChild(footer);

    /**
     * Funktion för att skapa ett meddelande och sedan skriva ut det. Anropas av händelsehanterare.
     * @param e Händelsen som triggade.
     */
    send = function (e) {
        var message,
            buttons,
            removeButton,
            timeButton;

        if (textArea.value.trim() !== "") {
            message = new Message(textArea.value, new Date());

            that.messages.push(message);
            document.getElementById("numberOfMessages").innerHTML = that.messages.length.toString();
            buttons = message.render(e); //skriver ut det nyligen skapade meddelandet i html-dokumentet. Fångar knapparna i dessa meddelanden så att händelsehanterare kan kopplas till dem.
            timeButton = buttons[0];
            removeButton = buttons[1];

            /**
             * Händelsehanterare för klick det nyligen skapade meddelandets radera-knapp.
             */
            removeButton.addEventListener('click', function (e) {
                var nodeToRemove = e.target.parentNode.parentNode,    //noden som ska tas bort
                    parentNodeToRemoveFrom = nodeToRemove.parentNode, //föräldern till noden som ska tas bort
                    index = 0,                                        //för att räkna ut meddelandets position
                    node = nodeToRemove;                              //för att räkna ut meddelandets position

                if (window.confirm("Vill du verkligen radera meddelandet?")) { //kontrollerar om användaren verkligen vill radera meddelandet. Annars görs ingenting.
                    while (node.previousElementSibling !== null) {
                        node = node.previousElementSibling;
                        index++;  //räknar ut meddelande-nodens position.
                    }
                    parentNodeToRemoveFrom.removeChild(nodeToRemove); //tar bort meddelande-noden från html-dokumentet.
                    that.messages.splice(index, 1);  //tar bort meddelandet från arrayen på angiven position.
                    document.getElementById("numberOfMessages").innerHTML = that.messages.length.toString();
                    textArea.focus();
                }
            }, false);

            /**
             * Händelsehanterare för det nyligen skapade meddelandets tid-knapp.
             */
            timeButton.addEventListener('click', function (e) {
                var node = e.target.parentNode.parentNode,     //den meddelande-node som innehåller den aktuella tid-knappen.
                    index = 0;                                 //index för att hålla reda på meddelandenoden.

                while (node.previousElementSibling !== null) { //räknar ut meddelandets position i den aktuella meddelandehanteraren.
                    index++;
                }

                window.alert("Meddelandet skickades " + that.messages[index].getDateTimeText() + ".");

            }, false);

            textArea.value = ""; //tömmer textarea-elementet.
        }

        textArea.focus(); //sätter fokus till textarea-elementet.

    };

    /**
     * Händelsehanterare för när användaren trycker på <Enter> efter att ha skrivit ett meddelande i textarea-elementet.
     */
    textArea.addEventListener('keydown', function (e) {
        if (e.keyCode === 13 && e.shiftKey !== true) {
            send(e);
            e.preventDefault(); //så inte en radbrytning läggs till i meddelanderutan efter det att meddelandet skickats.
        }
    }, false);

    /**
     * Händelsehanterare för när användaren klickar på skicka-knappen intill textarea-elementet.
     */
    sendButton.addEventListener('click', function (e) {
        send(e);
    }, false);

};