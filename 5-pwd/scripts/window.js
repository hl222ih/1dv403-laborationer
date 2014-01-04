"use strict";

var NS1DV403 = NS1DV403 || {};

NS1DV403.Window = function (height, width, name, hasMenuBar, hasStatusBar) {
    var appWindow,
        appTitleBar,
        appMenuBar,
        appContent,
        appStatusBar;

    appWindow = document.createElement('div');
    appWindow.setAttribute('class', 'appWindow');
    appWindow.setAttribute('style', 'height: ' + height + "px; width: " + width + "px;");
    appTitleBar = document.createElement('div');
    appTitleBar.setAttribute('class', 'appTitleBar');
    appTitleBar.appendChild(document.createTextNode(name));
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
