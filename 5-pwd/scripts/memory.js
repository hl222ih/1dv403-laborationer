"use strict";

var NS1DV403 = NS1DV403 || {};

NS1DV403.Memory = function (height, width) {
    var that = this;

    var menuElement = createMenu();

    NS1DV403.Window.call(this, height, width, 'Memory', true, true, 'images/memory64.png', menuElement);

    var rowsOfImages = 4, //antal rader i spelet
        colsOfImages = 4, //antal kolumner i spelet
        imageNumbers = NS1DV403.RandomGenerator.getPictureArray(rowsOfImages, colsOfImages), //slumpar ordningen på brickorna
        cards = [], //array med kort
        currentCards = [], //array med de kort som vänts upp för att matchas med varandra
        //board = document.getElementById("board"),//noden där tabellen med spelet skapas.
        board = this.getAppWindow().getElementsByClassName('appContent')[0],
        chooseImage, //metod som anropas av händelsehanterare (mus eller tangentbord)
        numberOfTries = 0, //lagrar antal försök
        numberOfMatches = 0; //lagrar antal brickor som matchats

    if ((rowsOfImages * colsOfImages) % 2 !== 0) {  //har ingen funktion som hanterar felet, men rader/kolumner är hårdkodade och antal brickor måste rimligtvis gå jämnt upp i antal par.
        throw new Error("Spelplanen måste ha ett jämnt antal brickor, justera antaler rader och kolumner.");
    }

    function Card(cardNumber, pictureNumber, isFlipped, isMatched) { //konstruktorfunktion för en bricka som håller koll på brickans nummer på spelplanen, brickans bildnummer, om brickan vänts och om brickan har matchats.
        if (typeof pictureNumber !== "number" || typeof cardNumber !== "number") {
            throw new Error("måste vara ett nummer");
        }
        this.getFrontPictureSource = function () {
            return "images/memory/" + pictureNumber + ".png";
        };
        this.getBackPictureSource = function () {
            return "images/memory/0.png";
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
    var renderHTMLTable = function (cols, rows) {
        var card, //en bricka
            i, //för loop
            j, //för loop
            tr, //nod för table-row
            td, //nod för datacell
            a, //nod för a-tagg
            img; //not för img-tagg

        var table = document.createElement('table');
        var thead = document.createElement('thead');
        var tbody = document.createElement('tbody');
        table.appendChild(thead);
        table.appendChild(tbody);

        for (i = 0; i < rows; i++) {
            tr = document.createElement("tr");
            for (j = 0; j < cols; j++) {
                td = document.createElement("td");
                a = document.createElement("a");
                a.setAttribute("class", (i * cols + j + 1).toString());
                a.setAttribute("href", "#");
                img = document.createElement("img");
                cards.push(new Card(i * cols + j + 1, imageNumbers[i * cols + j], false, false));
                img.setAttribute("src", cards[cards.length - 1].getBackPictureSource());
                a.appendChild(img);
                td.appendChild(a);
                tr.appendChild(td);
                td.style.width = 72 / parseInt(cols, 10) + '%';
            }
            //board.appendChild(tr);

            tbody.appendChild(tr);
        }

        table.setAttribute('class', 'memoryBoard');
        that.clearAppContent();
        that.addToAppContent(table);
    };


    this.createNewGame = function (cols, rows) {
        imageNumbers = NS1DV403.RandomGenerator.getPictureArray(rowsOfImages, colsOfImages);
        cards = [];
        currentCards = [];
        numberOfTries = 0;
        numberOfMatches = 0;
        renderHTMLTable(colsOfImages, rowsOfImages);
        that.setStatusBarText("Spela med piltangenterna och mellanslag!");
    };

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
            a.focus();
        }

        if (img !== undefined) {

            if (a.hasAttribute("class")) {
                cardNumber = parseInt(a.getAttribute("class"), 10);
            }
            card = cards[cardNumber - 1];
            if (!card.getIsFlipped() && !card.getIsMatched()) { //vill bara att något ska hända om brickorna som klickats inte redan har vänts upp eller matchats tidigare.
                card.setIsFlipped(true);
                img.setAttribute("src", card.getFrontPictureSource());
                currentCards.push(card);

                if (currentCards.length % 2 === 0) {
                    setTimeout(function () { //lite dubbel-kod i denna funktionen, men gick snabbare än att loopa igenom en array med två element.
                        var a1 = that.getAppWindow().getElementsByClassName(currentCards[0].getCardNumber().toString())[0],//a-taggen för den första brickan.
                            a2 = that.getAppWindow().getElementsByClassName(currentCards[1].getCardNumber().toString())[0],
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
                        //document.getElementById("numberOfTries").innerText = "Antal försök: " + numberOfTries.toString();
                        that.setStatusBarText("Antal försök: " + numberOfTries.toString());
                        if (numberOfMatches === colsOfImages * rowsOfImages) { //kontrollerar om alla brickor på spelplanen har parats.
                            //document.getElementById("numberOfTries").innerHTML = "Spelet är slut. <br />" +
                            that.setStatusBarText("Grattis! Resultatet blev " + numberOfTries.toString() + " försök!");
                            //"Grattis! Du klarade det på " + numberOfTries.toString() + " försök!";
                        }
                    }, 1200); //visa brickorna i 1.2 sekunder efter att båda brickorna vänts upp.
                }
            }

        }
    };

    function createMenu() {

        var menuHead = document.createElement('ul');
        menuHead.setAttribute('class', 'menuHead');

        var menuItemTop = document.createElement('li');
        menuItemTop.setAttribute('class', 'menuItemTop');
        menuItemTop.appendChild(document.createTextNode("Inställningar"));

        var menuBody = document.createElement('ul');
        menuBody.setAttribute('class', 'menuBody');
        var menuItemMiddle1 = document.createElement('li');
        menuItemMiddle1.appendChild(document.createTextNode("Börja om..."));
        menuItemMiddle1.setAttribute('class', 'menuItemMiddle');
        menuItemMiddle1.dataset.rows = 4;
        menuItemMiddle1.dataset.cols = 4;

        var getNewMenuItem = function (cols, rows) {
            var menuItem = document.createElement('li');
            menuItem.setAttribute('class', 'menuItemMiddle');
            menuItem.appendChild(document.createTextNode('Antal bilder ' + cols + ' x ' + rows));
            menuItem.dataset.rows = rows;
            menuItem.dataset.cols = cols;
            return menuItem;
        };

        var menuItems = [
            getNewMenuItem(3, 2),
            getNewMenuItem(4, 3),
            getNewMenuItem(4, 4),
            getNewMenuItem(5, 4),
            getNewMenuItem(6, 4),
            getNewMenuItem(6, 5)
        ];

        menuItems[menuItems.length - 1].setAttribute('class', 'menuItemBottom'); //sista är bottom


        menuHead.appendChild(menuItemTop);
        menuItemTop.appendChild(menuBody);
        menuBody.appendChild(menuItemMiddle1);
        for (var i = 0; i < menuItems.length; i++) {
            menuBody.appendChild(menuItems[i]);
        }

        menuItemTop.addEventListener('mouseenter', function (e) {
            var allMenuItems = menuItemTop.querySelectorAll('.menuItemMiddle, .menuItemBottom'),
                i;

            for (i = 0; i < allMenuItems.length; i++) {
                allMenuItems[i].style.display = 'inline-block';
            }
        }, false);

        menuItemTop.addEventListener('mouseleave', function (e) {
            var allMenuItems = menuItemTop.querySelectorAll('.menuItemMiddle, .menuItemBottom'),
                i;

            for (i = 0; i < allMenuItems.length; i++) {
                allMenuItems[i].style.display = 'none';
            }
        }, false);

        menuItemTop.addEventListener('click', function (e) {
            var allMenuItems = menuItemTop.querySelectorAll('.menuItemMiddle, .menuItemBottom'),
                i;
            if (e.target.dataset.rows && e.target.dataset.cols) {
                rowsOfImages = parseInt(e.target.dataset.rows, 10);
                colsOfImages = parseInt(e.target.dataset.cols, 10);
                menuItemMiddle1.dataset.rows = rowsOfImages;
                menuItemMiddle1.dataset.cols = colsOfImages;
                that.createNewGame(colsOfImages, rowsOfImages);
            }
            for (i = 0; i < allMenuItems.length; i++) {
                allMenuItems[i].style.display = 'none';
            }

        }, false);

        return menuHead;
    }

    board.addEventListener("mousedown", function (e) {
        if (e.target.tagName === "A" || e.target.tagName === "IMG") {
            chooseImage(e);
        }
        e.preventDefault();
    }, false);

    //Vänder på brickorna eller navigerar mellan dem med piltangenterna.
    board.addEventListener("keydown", function (e) {
        var imageNumber;

        if (e.keyCode === 13 || e.keyCode === 32) { //vänd med enter eller mellanslag.
            chooseImage(e);
        } else if (e.keyCode === 37) { //vänsterpil
            imageNumber = parseInt(e.target.getAttribute("class"), 10);
            if (imageNumber !== 1) {
                that.getAppWindow().getElementsByClassName((imageNumber - 1).toString())[0].focus();
            }
        } else if (e.keyCode === 38) { //uppil
            imageNumber = parseInt(e.target.getAttribute("class"), 10);
            if (imageNumber > colsOfImages) {
                that.getAppWindow().getElementsByClassName((imageNumber - colsOfImages).toString())[0].focus();
            }
        } else if (e.keyCode === 39) { //högerpil
            imageNumber = parseInt(e.target.getAttribute("class"), 10);
            if (imageNumber !== colsOfImages * rowsOfImages) {
                that.getAppWindow().getElementsByClassName((imageNumber + 1).toString())[0].focus();
            }
        } else if (e.keyCode === 40) { //nedpil
            imageNumber = parseInt(e.target.getAttribute("class"), 10);
            if (imageNumber <= colsOfImages * rowsOfImages - colsOfImages) {
                that.getAppWindow().getElementsByClassName((imageNumber + colsOfImages).toString())[0].focus();
            }
        }

    }, false);


    this.getType = function () {
        return 'Memory';
    };

};