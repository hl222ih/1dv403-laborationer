"use strict";

var NS1DV403 = NS1DV403 || {};

NS1DV403.RssReader = function (height, width) {
    var xhr = new XMLHttpRequest(),
        that = this,
        menuElement = createMenu(),
        currentRssFeedUrl;

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
            var feedMessages,
                feedMessageDivs,
                i,
                rssItemDiv,
                rssHeadingDiv,
                rssLinkAnchor,
                rssMessageDiv,
                rssMessages;

            if (xhr.readyState === 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                    that.setStatusBarText("");
                    that.hideWaitIcon();
                    clearTimeout(timeOutId);

                    that.clearAppContent();

                    feedMessages = xhr.responseText.match(/((?:<h2)(?:.|\r?\n)*?)(?=<h2)/g);
                    feedMessageDivs = feedMessages.map( function (msg) {
                        var div,
                            elements,
                            j;

                        div = document.createElement('div');
                        div.innerHTML = msg;
                        elements = div.querySelectorAll('*');
                        for (i = 0; i < elements.length; i++) {
                            elements[i].removeAttribute('style');
                        }
                        return div;
                    });
                    for (i = 0; i < feedMessageDivs.length; i++) {
                        rssItemDiv = document.createElement('div');
                        rssItemDiv.setAttribute('class', 'rssItem');
                        rssHeadingDiv = document.createElement('h2');
                        rssHeadingDiv.setAttribute('class', 'rssHeading');
                        rssHeadingDiv.innerHTML = feedMessageDivs[i].getElementsByTagName('h2')[0].innerHTML || '';
                        rssLinkAnchor = feedMessageDivs[i].getElementsByTagName('a')[0] || document.createElement('a');
                        rssLinkAnchor.setAttribute('class', 'rssLink');
                        rssLinkAnchor.setAttribute('target', '_blank');
                        rssMessageDiv = document.createElement('div');
                        rssMessageDiv.setAttribute('class', 'rssMessage');
                        rssMessages = feedMessageDivs[i].innerHTML.match(/(<p>(?:.|\r?\n)*<\/p>)/);
                        if (rssMessages) {
                            rssMessageDiv.innerHTML = rssMessages[0];
                        } else {
                            rssMessageDiv.innerHTML = '<p>Innehåll saknas.</p>';
                        }
                        rssItemDiv.appendChild(rssHeadingDiv);
                        rssItemDiv.appendChild(rssLinkAnchor);
                        rssItemDiv.appendChild(rssMessageDiv);

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

        var menuHead,
            menuItemTop,
            menuBody,
            menuItemMiddle1,
            menuItemMiddle2,
            menuItemBottom;

        menuHead = document.createElement('ul');
        menuHead.setAttribute('class', 'menuHead');

        menuItemTop = document.createElement('li');
        menuItemTop.setAttribute('class', 'menuItemTop');
        menuItemTop.appendChild(document.createTextNode("Inställningar"));

        menuBody = document.createElement('ul');
        menuBody.setAttribute('class', 'menuBody');
        menuItemMiddle1 = document.createElement('li');
        menuItemMiddle1.appendChild(document.createTextNode("Uppdateringsintervall..."));
        menuItemMiddle1.setAttribute('class', 'menuItemMiddle');
        menuItemMiddle2 = document.createElement('li');
        menuItemMiddle2.setAttribute('class', 'menuItemMiddle');
        menuItemMiddle2.appendChild(document.createTextNode("Välj källa..."));
        menuItemBottom = document.createElement('li');
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
        var rssIntervalSettingDiv = document.createElement('div'),
            rssIntervalSettingButton = document.createElement('button'),
            rssLabel = document.createElement('label'),
            rssForm = document.createElement('form'),
            rssSelect = document.createElement('select'),
            rssFeedSettingDiv,
            addRadioOptionToRssForm,
            rssTextBox,
            rssFeedSettingButton;

        rssIntervalSettingDiv.setAttribute('class', 'rssIntervalSetting');
        rssIntervalSettingButton.appendChild(document.createTextNode('Välj'));
        rssLabel.appendChild(document.createTextNode('Välj uppdateringsintervall: '));
        rssForm.setAttribute('class', 'rssForm');
        rssSelect.setAttribute('class', 'rssSelect');

        rssSelect.options.add(new Option('6 sekunder (för testning)', '0.1'));
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

        rssFeedSettingDiv = document.createElement('div');
        rssFeedSettingDiv.setAttribute('class', 'rssFeedSetting');
        rssForm = document.createElement('form');
        rssForm.setAttribute('class', 'rssForm');

        addRadioOptionToRssForm = function (url, optionText, checked) {
            var rssRadio,
                rssRadioLabel;

            rssRadio = document.createElement('input');
            rssRadio.setAttribute('type', 'radio');
            rssRadio.setAttribute('class', 'rssRadio');
            rssRadio.setAttribute('name', 'rssRadioGroup');
            rssRadioLabel = document.createElement('label');
            rssRadioLabel.setAttribute('class', 'rssRadioLabel');
            rssRadio.setAttribute('value', url);
            rssRadioLabel.appendChild(rssRadio);
            rssRadioLabel.appendChild(document.createTextNode(optionText));
            rssForm.appendChild(rssRadioLabel);
            if (checked === true) {
                rssRadio.setAttribute('checked', 'true');
            }
        };

        addRadioOptionToRssForm('http://feeds.idg.se/idg/vzzs', 'IDG.se Nyheter');
        addRadioOptionToRssForm('http://www.dn.se/m/rss/senaste-nytt', 'Dagens Nyheter', true);
        addRadioOptionToRssForm('http://feeds.feedburner.com/SenasteFilmerna?format=xml', 'Senaste Filmerna');
        addRadioOptionToRssForm('http://rss.computerworld.com/computerworld/news/feed?format=xml', 'ComputerWorld');
        addRadioOptionToRssForm('http://www.aftonbladet.se/senastenytt/ttnyheter/inrikes/rss.xml', 'Aftonbladet');
        addRadioOptionToRssForm('egen', 'Eget RSS-flöde enligt nedan...');

        rssTextBox = document.createElement('input');
        rssTextBox.setAttribute('class', 'rssTextBox');
        rssTextBox.setAttribute('type', 'text');
        rssForm.appendChild(rssTextBox);

        rssFeedSettingButton = document.createElement('button');
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
        if (that.intervalId) {
            clearInterval(this.intervalId);
        }
        that.updateRssFeed();
        that.intervalId = setInterval(function () {
            that.updateRssFeed();
        }, parseFloat(minutes) * 60000);
    };
};