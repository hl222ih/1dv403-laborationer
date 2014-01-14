"use strict";

var NS1DV403 = NS1DV403 || {};

/**
 * @constructor En meddelandehanterare.
 */
NS1DV403.LabbyMezzage = function (height, width) {
    var that = this,
        menuElement = createMenu();

    NS1DV403.Window.call(this, height, width, 'LabbyMezzage', true, true, 'images/labby64.png', menuElement);

    this.getType = function () {
        return 'LabbyMezzage';
    };

    var sendButton,
        textArea;


    this.messages = [];
    this.render();

    function createMenu() {

        var menuHead = document.createElement('ul');
        menuHead.setAttribute('class', 'menuHead');

        var menuItemTop = document.createElement('li');
        menuItemTop.setAttribute('class', 'menuItemTop');
        menuItemTop.appendChild(document.createTextNode("Inställningar"));

        var menuBody = document.createElement('ul');
        menuBody.setAttribute('class', 'menuBody');
        var menuItemMiddle1 = document.createElement('li');
        menuItemMiddle1.appendChild(document.createTextNode("Uppdateringsintervall..."));
        menuItemMiddle1.setAttribute('class', 'menuItemMiddle');
        var menuItemMiddle2 = document.createElement('li');
        menuItemMiddle2.setAttribute('class', 'menuItemMiddle');
        menuItemMiddle2.appendChild(document.createTextNode("Välj källa..."));
        var menuItemBottom = document.createElement('li');
        menuItemBottom.setAttribute('class', 'menuItemBottom');
        menuItemBottom.appendChild(document.createTextNode("Uppdatera nu"));

        menuHead.appendChild(menuItemTop);
        menuItemTop.appendChild(menuBody);
        menuBody.appendChild(menuItemMiddle1);
        menuBody.appendChild(menuItemMiddle2);
        menuBody.appendChild(menuItemBottom);

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

        //uppdateringsintervall
        menuItemMiddle1.addEventListener('click', function (e) {
            var div = that.getAppWindow().getElementsByClassName('rssIntervalSetting')[0];
            div.style.display = 'block';
        }, false);

        //välj källa
        menuItemMiddle2.addEventListener('click', function (e) {
            var div = that.getAppWindow().getElementsByClassName('rssFeedSetting')[0];
            div.style.display = 'block';
        }, false);

        //uppdatera nu
        menuItemBottom.addEventListener('click', function (e) {
            var allMenuItems = menuItemTop.querySelectorAll('.menuItemMiddle, .menuItemBottom'),
                i;

            that.updateMessages();
            for (i = 0; i < allMenuItems.length; i++) {
                allMenuItems[i].style.display = 'none';
            }

        }, false);


        return menuHead;
    }

    this.updateMessages = function () {
        var xhr = new XMLHttpRequest();

        var timeOutId;

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                    that.setStatusBarText("");
                    that.hideWaitIcon();
                    clearTimeout(timeOutId);

                    that.clearAppContent();
                   // window.alert(xhr.responseText.toString());

                    //var responseDiv = document.createElement('div');
                   // responseDiv.innerHtml = xhr.responseText.match(/((?:<messages>)(?:.|\r?\n)*?)(?=<\/messages>)/g);
                    // getElementsByTagName('messages')[0];
                    var parser = new DOMParser();
                    var responseXML = parser.parseFromString(xhr.responseText, "text/xml");

                    var messages = responseXML.getElementsByTagName('message');
                    var id, text, author, time;

                    for (var i = 0; i < messages.length; i++) {
                        id = messages[i].getElementsByTagName('id')[0];
                        text = messages[i].getElementsByTagName('text')[0];
                        author = messages[i].getElementsByTagName('author')[0];
                        if (author.textContent === '') {
                            author.textContent = 'Anonym';
                        }
                        time = messages[i].getElementsByTagName('time')[0];
                        var dateTime = new Date(parseInt(time.textContent, 10));
                        var message = new NS1DV403.Message(id.textContent, text.textContent, author.textContent, dateTime);
                        var messageNode = message.getMessageNode();
                        that.addToAppContent(messageNode);
                    }

                    var appContent = that.getAppWindow().getElementsByClassName('appContent')[0];
                    appContent.scrollTop = appContent.scrollHeight;

//                    var responseDiv = document.createElement('div');
//                    var feedMessages;
//                    feedMessages = xhr.responseText.match(/((?:<h2)(?:.|\r?\n)*?)(?=<h2)/g);
//                    var feedMessageDivs = feedMessages.map( function (msg) {
//                        var div,
//                            elements;
//                        div = document.createElement('div');
//                        div.innerHTML = msg;
//                        elements = div.querySelectorAll('*');
//                        for (var i = 0; i < elements.length; i++) {
//                            elements[i].removeAttribute('style');
//                        }
//                        return div;
//                    });
//                    for (var i = 0; i < feedMessageDivs.length; i++) {
//                        var rssItemDiv = document.createElement('div');
//                        rssItemDiv.setAttribute('class', 'rssItem');
//                        var rssHeadingDiv = document.createElement('h2');
//                        rssHeadingDiv.setAttribute('class', 'rssHeading');
//                        rssHeadingDiv.innerHTML = feedMessageDivs[i].getElementsByTagName('h2')[0].innerHTML || '';
//                        var rssLinkAnchor; //= document.createElement('a');
//                        rssLinkAnchor = feedMessageDivs[i].getElementsByTagName('a')[0] || document.createElement('a');
//
//                        rssLinkAnchor.setAttribute('class', 'rssLink');
//                        rssLinkAnchor.setAttribute('target', '_blank');
//                        var rssMessageDiv = document.createElement('div');
//                        rssMessageDiv.setAttribute('class', 'rssMessage');
//                        var rssMessages = feedMessageDivs[i].innerHTML.match(/(<p>(?:.|\r?\n)*<\/p>)/);
//                        if (rssMessages) {
//                            rssMessageDiv.innerHTML = rssMessages[0];
//                        } else {
//                            rssMessageDiv.innerHTML = '<p>Innehåll saknas.</p>';
//                        }
//                        rssItemDiv.appendChild(rssHeadingDiv);
//                        rssItemDiv.appendChild(rssLinkAnchor);
//                        rssItemDiv.appendChild(rssMessageDiv);
//
//                        //raw för debug
//                        //responseDiv.innerHTML = xhr.responseText;
//                        //that.addToAppContent(responseDiv);
//                        //---
//
//                        that.addToAppContent(rssItemDiv);
//                        that.setStatusBarText('Senast uppdaterad: ' + new Date().toLocaleString());
//                    }
                } else {
                    window.alert("Kunde inte läsas: " + xhr.status);
                }
                that.getAppWindow().style.cursor = "default";
            }
        };

        timeOutId = setTimeout(function () {
            that.setStatusBarText("hämtar meddelanden...");
            that.showWaitIcon();
            that.getAppWindow().style.cursor = "wait";
        }, 300);

        xhr.open('get', 'http://homepage.lnu.se/staff/tstjo/labbyserver/getMessage.php' +
            '?history=' + '10', true);
        xhr.send(null);
    };
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

//    messageBoardNode.appendChild(input);
  //  messageBoardNode.appendChild(content);
    //footer = container.lastElementChild;
    //container.removeChild(footer);
    var statusBar = container.getElementsByClassName('appStatusBar')[0];
    statusBar.parentNode.insertBefore(input, statusBar);
    //container.appendChild(footer);

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


