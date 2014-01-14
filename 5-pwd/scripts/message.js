"use strict";

var NS1DV403 = NS1DV403 || {};



/**
 * @constructor Ett meddelande.
 * @param {string} id Meddelandets id.
 * @param {string} text Meddelandets text.
 * @param {string} author Meddelandets författare.
 * @param {Date} date Meddelandets datum.
 */
NS1DV403.Message = function (id, text, author, date) {
    this.textMessage = text;
    this.dateOfMessage = date;
    this.id = id;
    this.author = author;

    this.getText = function () {
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
};


/**
 * Hjälpfunktion för att skapa korrekt tid- och datum format med inledande nolla.
 * @param number {number|string}
 * @returns {string} Om det inskickade argumentet är ett tecken långt, det inskickade argumentet med "0" framför, annars, det inskickade argumentet.
 */
NS1DV403.Message.prototype.padZero = function (number) {
    return (number.toString().length === 1) ? "0" + number : number.toString();
};

/**
 * Överlagring av default-toString().
 * @returns {string} Meddelandets text och datum.
 */
NS1DV403.Message.prototype.toString = function () {
    return this.getText() + " (" + this.getDate() + ")";
};

/**
 * @returns {string} Meddelandets text i html-format.
 */
NS1DV403.Message.prototype.getHtmlText = function () {
    return this.getText().replace(/[\n\r]/g, '<br />');
};

/**
 * @returns {string} Meddelandets datum i formatet YYYY-MM-DD.
 */
NS1DV403.Message.prototype.getDateText = function () {
    return this.getDate().getFullYear() + "-" + this.padZero((this.getDate().getMonth() + 1)) + "-" + this.padZero(this.getDate().getDate());
};

/**
 * @returns {string} Meddelandets tid i formatet HH:MM:SS.
 */
NS1DV403.Message.prototype.getTimeText = function () {
    return this.padZero(this.getDate().getHours()) + ":" + this.padZero(this.getDate().getMinutes()) + ":" + this.padZero(this.getDate().getSeconds());
};

/**
 * @returns {string} Meddelandets datum och tid i formatet YYYY-MM-DD HH:MM:SS.
 */
NS1DV403.Message.prototype.getDateTimeText = function () {
    return this.getDateText() + " " + this.getTimeText();
};

/**
 * Skapar och skriver ut html-koden för Message. Returnerar en array med node-objekten timeButton och removeButton
 * som behöver kopplas händelsehanterare till.
 * @returns {HTMLElement}
 */
NS1DV403.Message.prototype.getMessageNode = function () {
    var message = document.createElement("section"),
        header = document.createElement("div"),
        body = document.createElement("div"),
        text = document.createElement("p"),
        dateTime = document.createElement("div"),
        author = document.createElement('div'),
        authorName = document.createElement('div');
        //img = document.createElement('img');

    message.setAttribute('class', 'messageSection');
    header.setAttribute('class', 'messageHeader');
    body.setAttribute('class', 'messageBody');
    text.setAttribute('class', 'messageText');
    author.setAttribute('class', 'messageAuthor');
    authorName.setAttribute('class', 'messageAuthorName');
    dateTime.setAttribute('class', 'messageDateTime');
    //img.setAttribute('src', 'images/user128.png');

    message.dataset.id = this.id;
    text.appendChild(document.createTextNode(this.getHtmlText()));
    author.appendChild(authorName);
    //author.appendChild(img);
    authorName.appendChild(document.createTextNode(this.author));
    dateTime.appendChild(document.createTextNode(this.getDateTimeText()));


    header.appendChild(author);
    body.appendChild(dateTime);
    body.appendChild(text);
    message.appendChild(body);
    message.appendChild(header);

    return message;

};



