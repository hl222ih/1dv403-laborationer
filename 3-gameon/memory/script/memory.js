/*global RandomGenerator*/
"use strict";

window.onload = function () {
    var Rows = 4,
        Cols = 4,
        imageNumbers = RandomGenerator.getPictureArray(Rows, Cols),
        cards = [],
        pairedCards = [],
        currentCards = [],
        unpairedCards = [],
        board = document.getElementById("board"),
        chooseImage,
        numberOfTries = 0,
        numberOfMatches = 0;

    if ((Rows * Cols) % 2 !== 0) {
        throw new Error("Spelplanen måste ha ett jämnt antal brickor, justera antaler rader och kolumner.")
    }

    function Card(cardNumber, pictureNumber, isFlipped, isMatched) {
        if (typeof pictureNumber !== "number") {
            throw new Error("måste vara ett nummer");
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
        this.setIsFlipped = function (value) {
            isFlipped = value;
        };
        this.setIsMatched = function (value) {
            isMatched = value;
        };
    }

    function renderHTMLTable() {
        var card,
            i,
            j,
            //board = document.getElementById("board"),
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
                a.setAttribute("href", "#");
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

    chooseImage = function (e) {
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
            img = a.getElementsByTagName("img")[0];
        }

        if (img !== undefined) {

            if (a.hasAttribute("id")) {
                cardNumber = parseInt(a.getAttribute("id"), 10);
            }
            card = cards[cardNumber - 1];
            if (!card.getIsFlipped() && !card.getIsMatched()) {
                card.setIsFlipped(true);
                img.setAttribute("src", card.getFrontPictureSource());
                currentCards.push(card);

                if (currentCards.length % 2 === 0) {
                    setTimeout(function () {
                        var a1 = document.getElementById(currentCards[0].getCardNumber().toString()),
                            a2 = document.getElementById(currentCards[1].getCardNumber().toString()),
                            img1 = a1.getElementsByTagName("img")[0],
                            img2 = a2.getElementsByTagName("img")[0];


                        if (currentCards[0].getFrontPictureSource() !== currentCards[1].getFrontPictureSource()) {
                            img1.setAttribute("src", currentCards[0].getBackPictureSource());
                            currentCards[0].setIsFlipped(false);
                            img2.setAttribute("src", currentCards[1].getBackPictureSource());
                            currentCards[1].setIsFlipped(false);
                        } else {
                            currentCards[0].setIsFlipped(false);
                            currentCards[0].setIsMatched(true);
                            currentCards[1].setIsFlipped(false);
                            currentCards[1].setIsMatched(true);
                            numberOfMatches += 2;
                        }

                        currentCards.shift();
                        currentCards.shift();
                        numberOfTries++;
                        document.getElementById("numberOfTries").innerText = "Antal försök: " + numberOfTries.toString();
                        if (numberOfMatches === Cols * Rows) {
                            document.getElementById("numberOfTries").innerHTML = "Spelet är slut. <br />" +
                                "Grattis! Du klarade det på " + numberOfTries.toString() + " försök!";
                        }

                    }, 1000); //visa brickorna i en sekund efter att båda brickorna vänts upp.
                }
            }

        }
    };

    board.addEventListener("mousedown", function (e) {
        chooseImage(e);
    }, true);

    //Vänder på brickorna eller navigerar mellan dem med piltangenterna.
    board.addEventListener("keydown", function (e) {
        var imageNumber;

        if (e.keyCode === 13 || e.keyCode === 32) { //vänd med enter eller mellanslag.
            chooseImage(e);
        } else if (e.keyCode === 37) { //vänsterpil
            imageNumber = parseInt(e.target.getAttribute("id"), 10);
            if (imageNumber !== 1) {
                document.getElementById((imageNumber - 1).toString()).focus();
            }
        } else if (e.keyCode === 38) { //uppil
            imageNumber = parseInt(e.target.getAttribute("id"), 10);
            if (imageNumber > Cols) {
                document.getElementById((imageNumber - Cols).toString()).focus();
            }
        } else if (e.keyCode === 39) { //högerpil
            imageNumber = parseInt(e.target.getAttribute("id"), 10);
            if (imageNumber !== Cols * Rows) {
                document.getElementById((imageNumber + 1).toString()).focus();
            }
        } else if (e.keyCode === 40) { //nedpil
            imageNumber = parseInt(e.target.getAttribute("id"), 10);
            if (imageNumber <= Cols * Rows - Cols) {
                document.getElementById((imageNumber + Cols).toString()).focus();
            }
        }

    }, true);
};