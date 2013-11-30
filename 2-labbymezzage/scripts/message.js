/**
 * @constructor Ett meddelande.
 * @param {string} text Meddelandets text.
 * @param {Date} date Meddelandets datum.
 */
function Message(text, date) {
    "use strict";
    //endast åtkomst via getters och setters.
   // var textMessage,      //meddelandets text
    //    dateOfMessage;    //meddelandets datum-objekt

    this.textMessage = text;
    this.dateOfMessage = date;

    this.getText = function () {
        //return textMessage;
        return text;
    };
    this.setText = function (value) {
        text = value;
    };
    this.getDate = function () {
        return date;
    };
    this.setDate = function (value) {
        date = value;
    };
}

/**
 * "Privat" hjälpfunktion för att skapa korrekt tid- och datum format med inledande nolla.
 * @param number {number|string}
 * @returns {string} Om det inskickade argumentet är ett tecken långt, det inskickade argumentet med "0" framför, annars, det inskickade argumentet.
 */
var padZero = function (number) {
    "use strict";
    return (number.toString().length === 1) ? "0" + number : number.toString();
};


/**
 * Överlagring av default-toString().
 * @returns {string} Meddelandets text och datum.
 */
Message.prototype.toString = function () {
    "use strict";
    return this.getText() + " (" + this.getDate() + ")";
};

/**
 * @returns {string} Meddelandets text i html-format.
 */
Message.prototype.getHtmlText = function () {
    "use strict";
    return this.getText().replace(/\n/g, '<br />');
};

/**
 * @returns {string} Meddelandets datum i formatet YYYY-MM-DD.
 */
Message.prototype.getDateText = function () {
    "use strict";
    return this.getDate().getFullYear() + "-" + padZero((this.getDate().getMonth() + 1)) + "-" + padZero(this.getDate().getDate());
};

/**
 * @returns {string} Meddelandets tid i formatet HH:MM:SS.
 */
Message.prototype.getTimeText = function () {
    "use strict";
    return padZero(this.getDate().getHours()) + ":" + padZero(this.getDate().getMinutes()) + ":" + padZero(this.getDate().getSeconds());
};

/**
 * @returns {string} Meddelandets datum och tid i formatet YYYY-MM-DD HH:MM:SS.
 */
Message.prototype.getDateTimeText = function () {
    "use strict";
    return this.getDateText() + " " + this.getTimeText();
};

Message.prototype.render = function (e) {
    "use strict";
    var createHere = e.target.parentNode.previousElementSibling,
        message = document.createElement("section"),
        buttons = document.createElement("div"),
        timeButton = document.createElement("img"),
        removeButton = document.createElement("img"),
        text = document.createElement("p"),
        dateTime = document.createElement("div");

    message.setAttribute("class", "message");
    buttons.setAttribute("class", "buttons");
    timeButton.setAttribute("src", "images/time.png");
    timeButton.setAttribute("class", "timeButton");
    removeButton.setAttribute("src", "images/remove.png");
    removeButton.setAttribute("class", "removeButton");
    text.innerHTML = this.getText();
    dateTime.setAttribute("class", "dateTime");
    dateTime.innerHTML = this.getDateTimeText();

    message.appendChild(buttons);
    buttons.appendChild(timeButton);
    buttons.appendChild(removeButton);
    message.appendChild(text);
    message.appendChild(dateTime);
    createHere.appendChild(message);

    removeButton.addEventListener('click', function (e) {
        //kontrollera först att användaren verkligen vill ta bort.
        var nodeToRemove = e.target.parentNode.parentNode,
            parentNodeToRemoveFrom = nodeToRemove.parentNode,
            index = 0,  //för att räkna ut meddelandets position
            node = nodeToRemove;  //för att räkna ut meddelandets position

        //Alternativ 1
        while (node.previousElementSibling !== null) {
            node = node.previousElementSibling;
            index++;
        }
        parentNodeToRemoveFrom.removeChild(nodeToRemove);
        this.messages.splice(index, 1);

        //Alternativ 2
        //
        //

        //ta reda på vilken nod i listan den kommer ifrån
        //ta bort detta nummer från arrayen
        //ta bort denna nod i listan.
    }, false);


};



