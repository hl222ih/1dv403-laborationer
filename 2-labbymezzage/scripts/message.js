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
        button1 = document.createElement("img"),
        button2 = document.createElement("img"),
        text = document.createElement("p"),
        dateTime = document.createElement("div");

    message.setAttribute("class", "message");
    buttons.setAttribute("class", "buttons");
    button1.setAttribute("src", "images/time.png");
    button2.setAttribute("src", "images/remove.png");
    text.innerHTML = this.getText();
    dateTime.setAttribute("class", "dateTime");
    dateTime.innerHTML = this.getDateTimeText();

    message.appendChild(buttons);
    buttons.appendChild(button1);
    buttons.appendChild(button2);
    message.appendChild(text);
    message.appendChild(dateTime);
    createHere.appendChild(message);
};



