/*global RandomGenerator*/
"use strict";

window.onload = function () {
    var Rows = 4,
        Cols = 4,
        imageNumbers = RandomGenerator.getPictureArray(Rows, Cols),
        cards = [],
        pairedCards = [],
        currentCards = [],
        unpairedCards = [];

    if ((Rows * Cols) % 2 !== 0) {
        throw new Error("Spelplanen måste ha ett jämnt antal brickor, justera antaler rader och kolumner.")
    }

    function Card(cardNumber, pictureNumber, isFlipped, isMatched) {
        if (typeof pictureNumber !== "number") {
            throw new Error("must state a number");
        }
        this.getFrontPictureSource = function () {
            return "pics/" + pictureNumber + ".png";
        };
        this.getBackPictureSource = function () {
            return "pics/0.png";
        };
        this.getPictureNumber = function () {
            return parseInt(pictureNumber, 10);
        };
        this.getCardNumber = function () {
            return parseInt(cardNumber, 10);
        };
        this.getIsFlipped = function () {
            return isFlipped;
        };
        this.getIsMatched = function () {
            return isMatched;
        };
    }

    function renderHTMLTable() {
        var card,
            i,
            j,
            board = document.getElementById("board"),
            tr,
            td,
            a,
            img;



        for (i = 0; i < Rows; i++) {
            tr = document.createElement("tr");
            for (j = 0; j < Cols; j++) {
                td = document.createElement("td");
                a = document.createElement("a");
                a.setAttribute("id", (i * Cols + j + 1).toString());
                img = document.createElement("img");
                cards.push(new Card(i * Cols + j + 1, imageNumbers[i * Cols + j], false, false));
                img.setAttribute("src", cards[cards.length - 1].getBackPictureSource());
                a.appendChild(img);
                td.appendChild(a);
                tr.appendChild(td);
            }
            board.appendChild(tr);
        }
    }

    renderHTMLTable();


    var board = document.getElementById("board");
    board.addEventListener("mousedown", function (e) {
        var node,
            img,
            a,
            cardNumber,
            card;

        node = e.target;
        while (node !== null && node.tagName !== "A") {
            node = node.parentNode;
        }

        if (node !== null) {
            a = node;
        }

        img = a.getElementsByTagName("img")[0];

        if (img !== undefined) {
            if (a.hasAttribute("id")) {
                cardNumber = parseInt(a.getAttribute("id"), 10);
            }
            card = cards[cardNumber - 1];
            img.setAttribute("src", card.getFrontPictureSource());
            currentCards.push(card);

            if (currentCards.length === 2) {
                setTimeout(function () {
                    var a1 = document.getElementById(currentCards[0].getCardNumber().toString()),
                        a2 = document.getElementById(currentCards[1].getCardNumber().toString());

                    a1.getElementsByTagName("img")[0].setAttribute("src", currentCards[0].getBackPictureSource());
                    a2.getElementsByTagName("img")[0].setAttribute("src", currentCards[1].getBackPictureSource());

                    currentCards.shift();
                    currentCards.shift();
                }, 1200);
            }

        }
    }, true);

};