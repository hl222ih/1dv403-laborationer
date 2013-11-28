/**
 * @constructor Ett meddelande.
 * @param {string} text Meddelandets text.
 * @param {Date} date Meddelandets datum.
 */
function Message(text, date) {
    "use strict";
    //endast åtkomst via getters och setters.
    var textMessage,      //meddelandets text
        dateOfMessage;    //meddelandets datum-objekt

    this.getText = function () {
        return textMessage;
    };
    this.setText = function (text) {
        textMessage = text;
    };
    this.getDate = function () {
        return dateOfMessage;
    };
    this.setDate = function (date) {
        dateOfMessage = date;
    };
}

/**
 * "Privat" hjälpfunktion för att skapa korrekt tid- och datum format med inledande nolla.
 * @param number {number|string}
 * @returns {string} Om det inskickade argumentet är ett tecken långt, det inskickade argumentet med "0" framför, annars, det inskickade argumentet.
 */
var padZero = function (number) {
    "use strict";
    window.console.log(number.length);
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


