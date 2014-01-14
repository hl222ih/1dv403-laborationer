"use strict";

var NS1DV403 = NS1DV403 || {};

NS1DV403.RssReader = function (height, width) {
    var xhr = new XMLHttpRequest(),
        that = this,
        menuElement,
        currentRssFeedUrl,
        intervalId;

    menuElement = createMenu();

    NS1DV403.Window.call(this, height, width, 'RSS Reader', true, true, 'images/rss32.png', menuElement);

    createSettingsDiv();

    this.getType = function () {
        return 'RssReader';
    };

    this.getCurrentRssFeedUrl = function () {
        return currentRssFeedUrl;
    };
    this.setCurrentRssFeedUrl = function (url) {
        currentRssFeedUrl = url;
    };
    this.updateRssFeed = function (url) {
        var timeOutId;

        if (!url) {
            if (currentRssFeedUrl) {
                url = currentRssFeedUrl;
            } else {
                url = 'http://www.dn.se/m/rss/senaste-nytt'; // <-default
            }
        } else {
            currentRssFeedUrl = url;
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                    that.setStatusBarText("");
                    that.hideWaitIcon();
                    clearTimeout(timeOutId);

                    that.clearAppContent();

                    var responseDiv = document.createElement('div');
                    var feedMessages;
                    feedMessages = xhr.responseText.match(/((?:<h2)(?:.|\r?\n)*?)(?=<h2)/g);
                    var feedMessageDivs = feedMessages.map( function (msg) {
                        var div,
                            elements;
                        div = document.createElement('div');
                        div.innerHTML = msg;
                        elements = div.querySelectorAll('*');
                        for (var i = 0; i < elements.length; i++) {
                            elements[i].removeAttribute('style');
                        }
                        return div;
                    });
                    for (var i = 0; i < feedMessageDivs.length; i++) {
                        var rssItemDiv = document.createElement('div');
                        rssItemDiv.setAttribute('class', 'rssItem');
                        var rssHeadingDiv = document.createElement('h2');
                        rssHeadingDiv.setAttribute('class', 'rssHeading');
                        rssHeadingDiv.innerHTML = feedMessageDivs[i].getElementsByTagName('h2')[0].innerHTML || '';
                        var rssLinkAnchor; //= document.createElement('a');
                        rssLinkAnchor = feedMessageDivs[i].getElementsByTagName('a')[0] || document.createElement('a');

                        rssLinkAnchor.setAttribute('class', 'rssLink');
                        rssLinkAnchor.setAttribute('target', '_blank');
                        var rssMessageDiv = document.createElement('div');
                        rssMessageDiv.setAttribute('class', 'rssMessage');
                        var rssMessages = feedMessageDivs[i].innerHTML.match(/(<p>(?:.|\r?\n)*<\/p>)/);
                        if (rssMessages) {
                            rssMessageDiv.innerHTML = rssMessages[0];
                        } else {
                            rssMessageDiv.innerHTML = '<p>Innehåll saknas.</p>';
                        }
                        rssItemDiv.appendChild(rssHeadingDiv);
                        rssItemDiv.appendChild(rssLinkAnchor);
                        rssItemDiv.appendChild(rssMessageDiv);

                        //raw för debug
                        //responseDiv.innerHTML = xhr.responseText;
                        //that.addToAppContent(responseDiv);
                        //---

                        that.addToAppContent(rssItemDiv);
                        that.setStatusBarText('Senast uppdaterad: ' + new Date().toLocaleString());
                    }
                } else {
                    window.alert("Kunde inte läsas: " + xhr.status);
                }
                that.getAppWindow().style.cursor = "default";
            }
        };

        timeOutId = setTimeout(function () {
            that.setStatusBarText("hämtar RSS-flöde...");
            that.showWaitIcon();
            that.getAppWindow().style.cursor = "wait";
        }, 300);

        xhr.open('get', 'http://homepage.lnu.se/staff/tstjo/labbyServer/rssproxy/' +
            //'?url=' + encodeURIComponent('http://www.dn.se/m/rss/senaste-nytt'), true);
            '?url=' + encodeURIComponent(url), true);
        xhr.send(null);

    };

    function createMenu() {

        //Menyn-strukturen ser ut så här:
        //Menyn består av ett ul-element (menuHead) med ett eller flera li-element(menuTopItem) som är menyrubrikerna.
        //Varje menybrubrik består av en rubriktext samt ett ul-element (menuBody) med noll eller flera
        //li-element (menuMiddleItem) samt det nedersta li-element (menuBottomItem).
        //I denna desktop-app används bara en rubrik, men det går att använda flera - se isåfall bara till att appfönstrets
        //minsta bredd ökas så att menyn alltid får plats.
        //Dessa li-element innehåller var sin text.
        //Alla li- och ul-element har tilldelats ett klassattribut med samma värde som variabelnamnen för CSS-styling.

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

            that.updateRssFeed();
            for (i = 0; i < allMenuItems.length; i++) {
                allMenuItems[i].style.display = 'none';
            }

        }, false);


        return menuHead;
    }

    function createSettingsDiv() {
        var rssIntervalSettingDiv = document.createElement('div');
        rssIntervalSettingDiv.setAttribute('class', 'rssIntervalSetting');
        var rssIntervalSettingButton = document.createElement('button');
        rssIntervalSettingButton.appendChild(document.createTextNode('Välj'));
        var rssLabel = document.createElement('label');
        rssLabel.appendChild(document.createTextNode('Välj uppdateringsintervall: '));
        var rssForm = document.createElement('form');
        rssForm.setAttribute('class', 'rssForm');
        var rssSelect = document.createElement('select');
        rssSelect.setAttribute('class', 'rssSelect');

        rssSelect.options.add(new Option('5 minuter', '5'));
        rssSelect.options.add(new Option('10 minuter', '10'));
        rssSelect.options.add(new Option('30 minuter', '30'));
        rssSelect.options.add(new Option('60 minuter', '60'));
        rssSelect.options.add(new Option('3 timmar', '180'));
        rssSelect.options.add(new Option('6 timmar', '360'));
        rssForm.appendChild(rssLabel);
        rssForm.appendChild(rssSelect);
        rssForm.appendChild(rssIntervalSettingButton);

        rssIntervalSettingDiv.appendChild(rssForm);

        rssIntervalSettingButton.addEventListener('click', function (e) {
            e = e || event;

            that.startUpdateInterval(rssSelect.options[rssSelect.selectedIndex].value);
            rssIntervalSettingDiv.style.display = 'none';

            e.stopPropagation();
            e.preventDefault();
        }, false);

        that.getAppWindow().appendChild(rssIntervalSettingDiv);

        var rssFeedSettingDiv = document.createElement('div');
        rssFeedSettingDiv.setAttribute('class', 'rssFeedSetting');
        rssForm = document.createElement('form');
        rssForm.setAttribute('class', 'rssForm');

        var rssRadio = document.createElement('input');
        rssRadio.setAttribute('type', 'radio');
        rssRadio.setAttribute('class', 'rssRadio');
        rssRadio.setAttribute('name', 'rssRadioGroup');
        var rssRadioLabel = document.createElement('label');
        rssRadioLabel.setAttribute('class', 'rssRadioLabel');
        rssRadio.setAttribute('value', 'http://feeds.idg.se/idg/vzzs');
        rssRadioLabel.appendChild(rssRadio);
        rssRadioLabel.appendChild(document.createTextNode('IDG.se Nyheter'));
        rssForm.appendChild(rssRadioLabel);


        rssRadio = document.createElement('input');
        rssRadio.setAttribute('type', 'radio');
        rssRadio.setAttribute('class', 'rssRadio');
        rssRadio.setAttribute('name', 'rssRadioGroup');
        rssRadioLabel = document.createElement('label');
        rssRadioLabel.setAttribute('class', 'rssRadioLabel');
        rssRadio.setAttribute('value', 'http://www.dn.se/m/rss/senaste-nytt');
        rssRadioLabel.appendChild(rssRadio);
        rssRadioLabel.appendChild(document.createTextNode('Dagens Nyheter'));
        rssForm.appendChild(rssRadioLabel);
        rssRadio.setAttribute('checked', 'true');

        rssRadio = document.createElement('input');
        rssRadio.setAttribute('type', 'radio');
        rssRadio.setAttribute('class', 'rssRadio');
        rssRadio.setAttribute('name', 'rssRadioGroup');
        rssRadioLabel = document.createElement('label');
        rssRadioLabel.setAttribute('class', 'rssRadioLabel');
        rssRadio.setAttribute('value', 'http://feeds.feedburner.com/SenasteFilmerna?format=xml');
        rssRadioLabel.appendChild(rssRadio);
        rssRadioLabel.appendChild(document.createTextNode('Senaste Filmerna'));
        rssForm.appendChild(rssRadioLabel);

        rssRadio = document.createElement('input');
        rssRadio.setAttribute('type', 'radio');
        rssRadio.setAttribute('class', 'rssRadio');
        rssRadio.setAttribute('name', 'rssRadioGroup');
        rssRadioLabel = document.createElement('label');
        rssRadioLabel.setAttribute('class', 'rssRadioLabel');
        rssRadio.setAttribute('value', 'http://rss.computerworld.com/computerworld/news/feed?format=xml');
        rssRadioLabel.appendChild(rssRadio);
        rssRadioLabel.appendChild(document.createTextNode('ComputerWorld'));
        rssForm.appendChild(rssRadioLabel);

        rssRadio = document.createElement('input');
        rssRadio.setAttribute('type', 'radio');
        rssRadio.setAttribute('class', 'rssRadio');
        rssRadio.setAttribute('name', 'rssRadioGroup');
        rssRadioLabel = document.createElement('label');
        rssRadioLabel.setAttribute('class', 'rssRadioLabel');
        rssRadio.setAttribute('value', 'http://www.aftonbladet.se/senastenytt/ttnyheter/inrikes/rss.xml');
        rssRadioLabel.appendChild(rssRadio);
        rssRadioLabel.appendChild(document.createTextNode('Aftonbladet'));
        rssForm.appendChild(rssRadioLabel);

        rssRadio = document.createElement('input');
        rssRadio.setAttribute('type', 'radio');
        rssRadio.setAttribute('class', 'rssRadio');
        rssRadio.setAttribute('name', 'rssRadioGroup');
        rssRadioLabel = document.createElement('label');
        rssRadioLabel.setAttribute('class', 'rssRadioLabel');
        rssRadio.setAttribute('value', 'egen');
        rssRadioLabel.appendChild(rssRadio);
        rssRadioLabel.appendChild(document.createTextNode('Eget RSS-flöde enligt nedan...'));
        rssForm.appendChild(rssRadioLabel);

        var rssTextBox = document.createElement('input', 'rssTextBox');
        rssTextBox.setAttribute('type', 'text');
        rssForm.appendChild(rssTextBox);

        var rssFeedSettingButton = document.createElement('button');
        rssFeedSettingButton.appendChild(document.createTextNode('Välj'));
        rssFeedSettingButton.setAttribute('for', 'rssRadioGroup');
        rssForm.appendChild(rssFeedSettingButton);

        rssFeedSettingDiv.appendChild(rssForm);


        rssFeedSettingButton.addEventListener('click', function (e) {
            var i = 0,
                radioButtonList = rssFeedSettingDiv.getElementsByClassName('rssRadio');

            e.stopPropagation();
            e.preventDefault();

            e = e || event;

            for (i; i < radioButtonList.length; i++) {
                if (radioButtonList[i].checked) {
                    if (radioButtonList[i].value === 'egen') {
                        that.updateRssFeed(rssTextBox.value);
                    } else {
                        that.updateRssFeed(radioButtonList[i].value);
                    }
                }
            }
            rssFeedSettingDiv.style.display = 'none';

        }, false);

        that.getAppWindow().appendChild(rssFeedSettingDiv);

    }

    this.startUpdateInterval = function (minutes) {
        if (intervalId) {
            clearInterval(intervalId);
        }
        that.updateRssFeed();
        intervalId = setInterval( function () {
            that.updateRssFeed();
        }, parseInt(minutes, 10) * 60000);
    };
};