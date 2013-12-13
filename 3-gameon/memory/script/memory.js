/*global RandomGenerator*/
"use strict";

window.onload = function () {
    var Rows = 4, //antal rader i spelet
        Cols = 4, //antal kolumner i spelet
        imageNumbers = RandomGenerator.getPictureArray(Rows, Cols), //slumpar ordningen på brickorna
        cards = [], //array med kort
        currentCards = [], //array med de kort som vänts upp för att matchas med varandra
        board = document.getElementById("board"),//noden där tabellen med spelet skapas.
        chooseImage, //metod som anropas av händelsehanterare (mus eller tangentbord)
        numberOfTries = 0, //lagrar antal försök
        numberOfMatches = 0; //lagrar antal brickor som matchats

    if ((Rows * Cols) % 2 !== 0) {  //har ingen funktion som hanterar felet, men rader/kolumner är hårdkodade och antal brickor måste rimligtvis gå jämnt upp i antal par.
        throw new Error("Spelplanen måste ha ett jämnt antal brickor, justera antaler rader och kolumner.")
    }

    function Card(cardNumber, pictureNumber, isFlipped, isMatched) { //konstruktorfunktion för en bricka som håller koll på brickans nummer på spelplanen, brickans bildnummer, om brickan vänts och om brickan har matchats.
        if (typeof pictureNumber !== "number" || typeof cardNumber !== "number") {
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

    //Funktion för att skapa nod-trädet med spelplanen och lägga in den i html-dokumentet.
    function renderHTMLTable() {
        var card, //en bricka
            i, //för loop
            j, //för loop
            tr, //nod för table-row
            td, //nod för datacell
            a, //nod för a-tagg
            img; //not för img-tagg

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

    //Funktion som används av händelsehanterarna för klick och tangentbord då spelaren vill vända på en bricka.
    //Den triggas av musklick (mousedown för att göra att spelet upplevs lite snabbare) eller enter/mellanslag.
    //Händelsehanteraren är kopplad till hela tabellen.
    chooseImage = function (e) {
        var node, //variabel för att stega fram till a-taggen.
            img,//aktuell img-tagg som ev. klickats.
            a,//aktuell a-tagg som ev. klickats.
            cardNumber,//elementets motsvarande brickas bricknummer, som motsvaras av a-taggens id-attribut.
            card; //den bricka som motsvaras av den klickade taggen.

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
            if (!card.getIsFlipped() && !card.getIsMatched()) { //vill bara att något ska hända om brickorna som klickats inte redan har vänts upp eller matchats tidigare.
                card.setIsFlipped(true);
                img.setAttribute("src", card.getFrontPictureSource());
                currentCards.push(card);

                if (currentCards.length % 2 === 0) {
                    setTimeout(function () { //lite dubbel-kod i denna funktionen, men gick snabbare än att loopa igenom en array med två element.
                        var a1 = document.getElementById(currentCards[0].getCardNumber().toString()),//a-taggen för den första brickan.
                            a2 = document.getElementById(currentCards[1].getCardNumber().toString()),
                            img1 = a1.getElementsByTagName("img")[0],//bilden för den första brickan.
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

                        currentCards.shift(); //tar bort de två parade brickorna.
                        currentCards.shift();
                        numberOfTries++; //räknar upp antal försök
                        document.getElementById("numberOfTries").innerText = "Antal försök: " + numberOfTries.toString();
                        if (numberOfMatches === Cols * Rows) { //kontrollerar om alla brickor på spelplanen har parats.
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
    }, true); //true för att inte agera på klick på board-id:t utan bara chilren till den noden.

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

    }, true); //true för att inte agera på klick på board-id:t utan bara chilren till den noden.
};