"use strict";

var NS1DV403 = NS1DV403 || {};



/**
 * @constructor Ett meddelande.
 * @param {string} text Meddelandets text.
 * @param {Date} date Meddelandets datum.
 */
NS1DV403.Message = function (text, date) {
    this.textMessage = text;
    this.dateOfMessage = date;

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
 * "Privat" hjälpfunktion för att skapa korrekt tid- och datum format med inledande nolla.
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
 * @returns {Array}
 */
NS1DV403.Message.prototype.render = function (e) {
    var createHere = e.target.parentNode.previousElementSibling, //platsen där html-elementet ska skapas.
        message = document.createElement("section"),             //skapar message-elementet.
        buttons = document.createElement("div"),                 //...
        timeImg = document.createElement("img"),
        timeButton = document.createElement("a"),
        removeImg = document.createElement("img"),
        removeButton = document.createElement("a"),
        text = document.createElement("p"),
        dateTime = document.createElement("div");

    message.setAttribute("class", "message");
    buttons.setAttribute("class", "buttons");
    timeImg.setAttribute("src", "images/time.png");
    timeButton.setAttribute("class", "timeButton");
    timeButton.setAttribute("href", "#");
    removeImg.setAttribute("src", "images/remove.png");
    removeButton.setAttribute("class", "removeButton");
    removeButton.setAttribute("href", "#");
    text.innerHTML = this.getHtmlText();
    dateTime.setAttribute("class", "dateTime");
    dateTime.innerHTML = this.getTimeText();

    message.appendChild(buttons);
    buttons.appendChild(timeButton);
    timeButton.appendChild(timeImg);
    buttons.appendChild(removeButton);
    removeButton.appendChild(removeImg);
    message.appendChild(text);
    message.appendChild(dateTime);
    createHere.appendChild(message);

    createHere.scrollTop = createHere.scrollHeight; //så att scrollen flyttas längst ned så att det nyligen tillagda meddelandet syns.

    //return [timeButton, removeButton];

};



