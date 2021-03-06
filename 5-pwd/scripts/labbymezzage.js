"use strict";

var NS1DV403 = NS1DV403 || {};

/**
 * @constructor En meddelandehanterare.
 */
NS1DV403.LabbyMezzage = function (height, width) {
    var that = this,
        currentNumberOfMessages,
        menuElement = createMenu();

    NS1DV403.Window.call(this, height, width, 'LabbyMezzage', true, true, 'images/labby64.png', menuElement);

    createSettingsDiv();

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
        menuItemMiddle2.appendChild(document.createTextNode("Antal meddelanden..."));
        var menuItemMiddle3 = document.createElement('li');
        menuItemMiddle3.setAttribute('class', 'menuItemMiddle');
        menuItemMiddle3.appendChild(document.createTextNode("Välj Alias..."));
        var menuItemBottom = document.createElement('li');
        menuItemBottom.setAttribute('class', 'menuItemBottom');
        menuItemBottom.appendChild(document.createTextNode("Uppdatera nu"));

        menuHead.appendChild(menuItemTop);
        menuItemTop.appendChild(menuBody);
        menuBody.appendChild(menuItemMiddle1);
        menuBody.appendChild(menuItemMiddle2);
        menuBody.appendChild(menuItemMiddle3);
        menuBody.appendChild(menuItemBottom);

        menuItemTop.addEventListener('mouseenter', function (e) {
            var allMenuItems = menuItemTop.querySelectorAll('.menuItemMiddle, .menuItemBottom'),
                i;

            for (i = 0; i < allMenuItems.length; i++) {
                allMenuItems[i].style.display = 'inline-block';
            }
        }, false);

        function hideMenuDropDown(e) {
            var allMenuItems = menuItemTop.querySelectorAll('.menuItemMiddle, .menuItemBottom'),
                i;

            for (i = 0; i < allMenuItems.length; i++) {
                allMenuItems[i].style.display = 'none';
            }
        }

        menuItemTop.addEventListener('mouseleave', hideMenuDropDown, false);
        menuItemTop.addEventListener('click', hideMenuDropDown, false);

        //uppdateringsintervall
        menuItemMiddle1.addEventListener('click', function (e) {
            var div = that.getAppWindow().getElementsByClassName('labbyIntervalSetting')[0];
            div.style.display = 'block';
        }, false);

        //välj antal meddelanden
        menuItemMiddle2.addEventListener('click', function (e) {
            var div = that.getAppWindow().getElementsByClassName('labbyNumberSetting')[0];
            div.style.display = 'block';
        }, false);

        //välj alias
        menuItemMiddle3.addEventListener('click', function (e) {
            var div = that.getAppWindow().getElementsByClassName('labbyAliasSetting')[0];
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

    this.updateMessages = function (numberOfMessages) {
        var xhr = new XMLHttpRequest();

        if (!numberOfMessages) {
            if (currentNumberOfMessages) {
                numberOfMessages = parseInt(currentNumberOfMessages, 10);
            } else {
                numberOfMessages = 10; // <-default
            }
        } else {
            currentNumberOfMessages = numberOfMessages;
            numberOfMessages = parseInt(numberOfMessages, 10);
        }

        var timeOutId;

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                    that.setStatusBarText("");
                    that.hideWaitIcon();
                    clearTimeout(timeOutId);

                    that.clearAppContent();
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

                    that.setStatusBarText('Senast uppdaterad: ' + new Date().toLocaleString());

                    var appContent = that.getAppWindow().getElementsByClassName('appContent')[0];
                    appContent.scrollTop = appContent.scrollHeight;

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
            '?history=' + numberOfMessages, true);
        xhr.send(null);
    };

    this.startUpdateInterval = function (minutes) {
        if (that.intervalId) {
            clearInterval(that.intervalId);
        }
        that.updateMessages();
        that.intervalId = setInterval( function () {
            that.updateMessages();
        }, parseFloat(minutes) * 60000);
    };

    if (window.localStorage.labbyName) {
        this.name = window.localStorage.labbyName;
    } else {
        this.name = '';
    }
    if (window.localStorage.labbyInterval) {
        this.startUpdateInterval(window.localStorage.labbyInterval);
    } else {
        this.startUpdateInterval(10);
    }
    if (window.localStorage.labbyNumberOfMessages) {
        currentNumberOfMessages = window.localStorage.labbyNumberOfMessages;
    } else {
        currentNumberOfMessages = 10;
    }

    function createSettingsDiv() {
        var labbyIntervalSettingDiv = document.createElement('div');
        labbyIntervalSettingDiv.setAttribute('class', 'labbyIntervalSetting');
        var labbyIntervalSettingButton = document.createElement('button');
        labbyIntervalSettingButton.appendChild(document.createTextNode('Välj'));
        var labbyLabel = document.createElement('label');
        labbyLabel.appendChild(document.createTextNode('Välj uppdateringsintervall: '));
        var labbyForm = document.createElement('form');
        labbyForm.setAttribute('class', 'labbyForm');
        var labbySelect = document.createElement('select');
        labbySelect.setAttribute('class', 'labbySelect');

        labbySelect.options.add(new Option('10 sekunder', '0.167'));
        labbySelect.options.add(new Option('30 sekunder', '0.5'));
        labbySelect.options.add(new Option('1 minuter', '1'));
        labbySelect.options.add(new Option('5 minuter', '5'));
        labbySelect.options.add(new Option('30 minuter', '30'));
        labbySelect.options.add(new Option('1 timme', '60'));
        labbyForm.appendChild(labbyLabel);
        labbyForm.appendChild(labbySelect);
        labbyForm.appendChild(labbyIntervalSettingButton);

        labbyIntervalSettingDiv.appendChild(labbyForm);

        labbyIntervalSettingButton.addEventListener('click', function (e) {
            e = e || event;

            that.startUpdateInterval(labbySelect.options[labbySelect.selectedIndex].value);

            window.localStorage.labbyInterval = labbySelect.options[labbySelect.selectedIndex].value;
            labbyIntervalSettingDiv.style.display = 'none';

            e.stopPropagation();
            e.preventDefault();
        }, false);

        that.getAppWindow().appendChild(labbyIntervalSettingDiv);

        var labbyNumberSettingDiv = document.createElement('div');
        labbyNumberSettingDiv.setAttribute('class', 'labbyNumberSetting');
        labbyForm = document.createElement('form');
        labbyForm.setAttribute('class', 'labbyForm');

        var labbyRadio = document.createElement('input');
        labbyRadio.setAttribute('type', 'radio');
        labbyRadio.setAttribute('class', 'labbyRadio');
        labbyRadio.setAttribute('name', 'labbyRadioGroup');
        var labbyRadioLabel = document.createElement('label');
        labbyRadioLabel.setAttribute('class', 'labbyRadioLabel');
        labbyRadio.setAttribute('value', '10');
        labbyRadioLabel.appendChild(labbyRadio);
        labbyRadioLabel.appendChild(document.createTextNode('10 meddelanden'));
        labbyForm.appendChild(labbyRadioLabel);


        labbyRadio = document.createElement('input');
        labbyRadio.setAttribute('type', 'radio');
        labbyRadio.setAttribute('class', 'labbyRadio');
        labbyRadio.setAttribute('name', 'labbyRadioGroup');
        labbyRadioLabel = document.createElement('label');
        labbyRadioLabel.setAttribute('class', 'labbyRadioLabel');
        labbyRadio.setAttribute('value', '25');
        labbyRadioLabel.appendChild(labbyRadio);
        labbyRadioLabel.appendChild(document.createTextNode('25 meddelanden'));
        labbyForm.appendChild(labbyRadioLabel);
        labbyRadio.setAttribute('checked', 'true');

        labbyRadio = document.createElement('input');
        labbyRadio.setAttribute('type', 'radio');
        labbyRadio.setAttribute('class', 'labbyRadio');
        labbyRadio.setAttribute('name', 'labbyRadioGroup');
        labbyRadioLabel = document.createElement('label');
        labbyRadioLabel.setAttribute('class', 'labbyRadioLabel');
        labbyRadio.setAttribute('value', '50');
        labbyRadioLabel.appendChild(labbyRadio);
        labbyRadioLabel.appendChild(document.createTextNode('50 meddelanden'));
        labbyForm.appendChild(labbyRadioLabel);

        labbyRadio = document.createElement('input');
        labbyRadio.setAttribute('type', 'radio');
        labbyRadio.setAttribute('class', 'labbyRadio');
        labbyRadio.setAttribute('name', 'labbyRadioGroup');
        labbyRadioLabel = document.createElement('label');
        labbyRadioLabel.setAttribute('class', 'labbyRadioLabel');
        labbyRadio.setAttribute('value', '100');
        labbyRadioLabel.appendChild(labbyRadio);
        labbyRadioLabel.appendChild(document.createTextNode('100 meddelanden'));
        labbyForm.appendChild(labbyRadioLabel);

        labbyRadio = document.createElement('input');
        labbyRadio.setAttribute('type', 'radio');
        labbyRadio.setAttribute('class', 'labbyRadio');
        labbyRadio.setAttribute('name', 'labbyRadioGroup');
        labbyRadioLabel = document.createElement('label');
        labbyRadioLabel.setAttribute('class', 'labbyRadioLabel');
        labbyRadio.setAttribute('value', '0');
        labbyRadioLabel.appendChild(labbyRadio);
        labbyRadioLabel.appendChild(document.createTextNode('Alla meddelanden'));
        labbyForm.appendChild(labbyRadioLabel);

        var labbyNumberSettingButton = document.createElement('button');
        labbyNumberSettingButton.appendChild(document.createTextNode('Välj'));
        labbyNumberSettingButton.setAttribute('for', 'labbyRadioGroup');
        labbyForm.appendChild(labbyNumberSettingButton);

        labbyNumberSettingDiv.appendChild(labbyForm);


        labbyNumberSettingButton.addEventListener('click', function (e) {
            var i = 0,
                radioButtonList = labbyNumberSettingDiv.getElementsByClassName('labbyRadio');

            e = e || event;

            e.stopPropagation();
            e.preventDefault();

            for (i; i < radioButtonList.length; i++) {
                if (radioButtonList[i].checked) {
                    currentNumberOfMessages = radioButtonList[i].value;
                }
            }
            window.localStorage.labbyNumberOfMessages = currentNumberOfMessages;
            that.updateMessages(currentNumberOfMessages);
            labbyNumberSettingDiv.style.display = 'none';

        }, false);

        that.getAppWindow().appendChild(labbyNumberSettingDiv);


        var labbyAliasSettingDiv = document.createElement('div');
        labbyAliasSettingDiv.setAttribute('class', 'labbyAliasSetting');

        labbyForm = document.createElement('form');
        labbyForm.setAttribute('class', 'labbyForm');
        var labbyAliasTextBox = document.createElement('input', 'labbyAliasTextBox');
        labbyAliasTextBox.setAttribute('type', 'text');
        labbyForm.appendChild(labbyAliasTextBox);

        var labbyAliasSettingButton = document.createElement('button');
        labbyAliasSettingButton.appendChild(document.createTextNode('Välj'));
        labbyForm.appendChild(labbyAliasSettingButton);

        labbyAliasSettingDiv.appendChild(labbyForm);


        labbyAliasSettingButton.addEventListener('click', function (e) {
            var i = 0;

            e = e || event;

            e.stopPropagation();
            e.preventDefault();

            window.localStorage.labbyName = labbyAliasTextBox.value;
            labbyAliasSettingDiv.style.display = 'none';

        }, false);

        that.getAppWindow().appendChild(labbyAliasSettingDiv);

    }

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

    var statusBar = container.getElementsByClassName('appStatusBar')[0];
    statusBar.parentNode.insertBefore(input, statusBar);

    /**
     * Funktion för att skapa och skicka iväg ett meddelande och sedan anropa en uppdatering från servern. Anropas av händelsehanterare.
     * @param e Händelsen som triggade.
     */
    send = function (e) {
        var message,
            author,
            xhr = new XMLHttpRequest();

        if (textArea.value.trim() !== "") {
            message = textArea.value.trim();
            if (window.localStorage.labbyName) {
                author = window.localStorage.labbyName;
            } else {
                author = 'Anonym';
            }
            textArea.value = ""; //tömmer textarea-elementet.

            xhr.open('post', 'http://homepage.lnu.se/staff/tstjo/labbyserver/setMessage.php', true);
            var formData = new FormData();
            formData.append('username', author);
            formData.append('text', message);
            xhr.send(formData);

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                        that.updateMessages();
                    }
                }
            };
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
