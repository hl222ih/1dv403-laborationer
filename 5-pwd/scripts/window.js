"use strict";

var NS1DV403 = NS1DV403 || {};

NS1DV403.Window = function (height, width, name, hasMenuBar, hasStatusBar) {
    var appWindow,
        appTitleBar,
        appRemoveButtonAnchor,
        appRemoveButton,
        appMenuBar,
        appContent,
        appStatusBar,
        appP;

    appWindow = document.createElement('div');
    appWindow.setAttribute('class', 'appWindow');
    appWindow.setAttribute('style', 'height: ' + height + "px; width: " + width + "px;");
    appTitleBar = document.createElement('div');
    appTitleBar.setAttribute('class', 'appTitleBar');
    appP = document.createElement('p');
    appP.setAttribute('class', 'appTitleBarText');
    appP.appendChild(document.createTextNode(name));
    appTitleBar.appendChild(appP);
    appRemoveButtonAnchor = document.createElement('a');
    appRemoveButtonAnchor.setAttribute('class', 'appRemoveButtonAnchor');
    appRemoveButtonAnchor.setAttribute('href', '#');
    appRemoveButtonAnchor.setAttribute('alt', 'stäng fönster');

    appRemoveButtonAnchor.addEventListener('click', function (e) {
        e.target.parentNode.parentNode.parentNode.parentNode.removeChild(appWindow);
    });

    appRemoveButton = document.createElement('img');
    appRemoveButton.setAttribute('class', 'appRemoveButton');
    appRemoveButton.setAttribute('src', 'images/remove.png');
    appRemoveButtonAnchor.appendChild(appRemoveButton);
    appTitleBar.appendChild(appRemoveButtonAnchor);
    appWindow.appendChild(appTitleBar);

    if (hasMenuBar) {
        appMenuBar = document.createElement('div');
        appMenuBar.setAttribute('class', 'appMenuBar');
        appWindow.appendChild(appMenuBar);
    }

    appContent = document.createElement('div');
    appContent.setAttribute('class', 'appContent');
    appWindow.appendChild(appContent);

    if (hasStatusBar) {
        appStatusBar = document.createElement('div');
        appStatusBar.setAttribute('class', 'appStatusBar');
        appWindow.appendChild(appStatusBar);
    }

    this.getAppWindow = function () {
        return appWindow;
    };
};
