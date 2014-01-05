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
        appStatusBarImage,
        appStatusBarLabel,
        appLabel;

    appWindow = document.createElement('div');
    appWindow.setAttribute('class', 'appWindow');
    appWindow.setAttribute('style', 'height: ' + height + "px; width: " + width + "px;");
    appTitleBar = document.createElement('div');
    appTitleBar.setAttribute('class', 'appTitleBar');
    appLabel = document.createElement('label');
    appLabel.setAttribute('class', 'appTitleBarLabel');
    appLabel.appendChild(document.createTextNode(name));
    appTitleBar.appendChild(appLabel);
    appRemoveButtonAnchor = document.createElement('a');
    appRemoveButtonAnchor.setAttribute('class', 'appRemoveButtonAnchor');
    appRemoveButtonAnchor.setAttribute('href', '#');
    appRemoveButtonAnchor.setAttribute('alt', 'stäng fönster');

    appRemoveButtonAnchor.addEventListener('click', function (e) {
        var currentNode = this; //this är den node användaren klickar på

        e = e || event;

        while (currentNode !== appWindow) {
            currentNode = currentNode.parentNode;
        }
        currentNode.parentNode.removeChild(appWindow);

        e.preventDefault(); //förhindra default action (dvs. att gå till den "tomma" länken "#")
        e.stopPropagation(); //förhindra vidare event bubbling

    }, false);

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
        appStatusBarLabel = document.createElement('label');
        appStatusBarLabel.setAttribute('class', 'appStatusBarLabel');
        appStatusBarImage = document.createElement('img');
        appStatusBarImage.setAttribute('src', 'images/ajax-loader.gif');
        appStatusBarImage.style.visibility = 'hidden';
        appStatusBar.appendChild(appStatusBarImage);
        appStatusBar.appendChild(appStatusBarLabel);

        this.setStatusBarText = function (text) {
            while (appStatusBarLabel.firstChild) {
                appStatusBarLabel.removeChild(appStatusBarLabel.firstChild);
            }
            appStatusBarLabel.appendChild(document.createTextNode(text));
        };

        appWindow.appendChild(appStatusBar);
    }

    this.getAppWindow = function () {
        return appWindow;
    };

    this.setPosition = function (xPosition, yPosition) {
        appWindow.style.top = xPosition + "px";
        appWindow.style.left = yPosition + "px";
    };

    this.showWaitIcon = function () {
        if (appStatusBarImage) {
            appStatusBarImage.style.visibility = 'visible';
        }
    };

    this.hideWaitIcon = function () {
        if (appStatusBarImage) {
            appStatusBarImage.style.visibility = 'hidden';
        }
    };

    this.addToAppContent = function (content) {
        appContent.appendChild(content);
    };
};
