"use strict";

var NS1DV403 = NS1DV403 || {};

NS1DV403.RssReader = function (height, width) {
    var xhr = new XMLHttpRequest(),
        timeOutId,
        that = this,
        menuElement;

    menuElement = createMenu();

    NS1DV403.Window.call(this, height, width, 'RSS Reader', true, true, 'images/rss16.png', menuElement);


    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                that.setStatusBarText("");
                that.hideWaitIcon();
                clearTimeout(timeOutId);
                var responseDiv = document.createElement('div');
                var feedMessages = [];
                feedMessages = xhr.responseText.match(/(<h2(?:.|\r?\n)*?<\/p>)/g);
                var feedMessageDivs = feedMessages.map( function (msg) {
                    var div;
                    div = document.createElement('div');
                    div.innerHTML = msg;
                    return div;
                });
                for (var i = 0; i < feedMessageDivs.length; i++) {
                    var rssItemDiv = document.createElement('div');
                    rssItemDiv.setAttribute('class', 'rssItem');
                    var rssHeadingDiv = document.createElement('h2');
                    rssHeadingDiv.setAttribute('class', 'rssHeading');
                    rssHeadingDiv.innerHTML = feedMessageDivs[i].getElementsByTagName('h2')[0].innerHTML;
                    var rssLinkAnchor; //= document.createElement('a');
                    rssLinkAnchor = feedMessageDivs[i].getElementsByTagName('a')[0] || document.createElement('a');
                    rssLinkAnchor.setAttribute('class', 'rssLink');
                    rssLinkAnchor.setAttribute('target', '_blank');
                    var rssMessageDiv = document.createElement('div');
                    rssMessageDiv.setAttribute('class', 'rssMessage');
                    rssMessageDiv.innerHTML = feedMessages[i].match(/(<p>(?:.|\r?\n)*?<\/p>)/)[0];
                    rssItemDiv.appendChild(rssHeadingDiv);
                    rssItemDiv.appendChild(rssLinkAnchor);
                    rssItemDiv.appendChild(rssMessageDiv);
                    that.addToAppContent(rssItemDiv);
                }
//                responseDiv.innerHTML = xhr.responseText;
//                that.addToAppContent(responseDiv);
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
        '?url=' + encodeURIComponent('http://www.dn.se/m/rss/senaste-nytt'), true);
    xhr.send(null);

    this.getType = function () {
        return 'RssReader';
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

        return menuHead;
    }
};