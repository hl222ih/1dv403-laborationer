"use strict";

var NS1DV403 = NS1DV403 || {};

/**
 * @constructor En meddelandehanterare.
 */
NS1DV403.LabbyMezzage = function (height, width) {
    var that = this;

    NS1DV403.Window.call(this, height, width, 'LabbyMezzage', false, true, 'images/labby64.png');

    this.getType = function () {
        return 'LabbyMezzage';
    };

    var sendButton,
        textArea;

    this.messages = [];
    this.render();
};

/**
 * Skapar och skriver ut html-koden för MessageBoard.
 */
NS1DV403.LabbyMezzage.prototype.render = function () {
    //var container = document.getElementById("container"),//html-dokumentets container-node.
    var container = this.getAppWindow(),
        messageBoardNode = document.createElement("div"),//skapar ett node-träd för en ny meddelandehanterare.
        content = document.createElement("div"),         //...
        input = document.createElement("div"),
        textArea = document.createElement("textarea"),
        sendButton = document.createElement("button"),
        //existingMessageBoardNodes = document.getElementsByClassName("messageBoard"), //en array med alla meddelarehanterare-noder.
        count,          //för användning i loopar.
        that = this,    //för användning av yttre variabler i closure
        tempAttribute,  //för att kunna göra ändringar i elementets attribut med hänsyn till den information som redan finns i elementets attribut.
        footer,         //html-dokumentets footer-node.
        send;           //funktion för att "skicka meddelande", skapar meddelandet, lägger till händelsehanterare, skriver ut det, med mera.

    //skapar attribut för de skapade elementen
    //messageBoardNode.setAttribute("class", "messageBoard");
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
            message = new NS1DV403.Message(textArea.value, new Date());
            //message ska skickas till servern.

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