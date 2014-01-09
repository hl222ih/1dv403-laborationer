"use strict";

var NS1DV403 = NS1DV403 || {};

NS1DV403.RssReader = function (height, width) {
    var xhr = new XMLHttpRequest(),
        timeOutId,
        that = this;
       // contentDiv = this.getAppWindow().getElementsByClassName('appContent');

    //contentDiv.style.

    NS1DV403.Window.call(this, height, width, 'RSS Reader', true, true, 'images/rss16.png');


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

};