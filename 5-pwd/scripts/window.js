"use strict";

var NS1DV403 = NS1DV403 || {};

NS1DV403.Window = function (height, width, name, hasMenuBar, hasStatusBar, iconUrl) {
    var appWindow,
        appTitleBarImage,
        appTitleBar,
        appRemoveButtonAnchor,
        appRemoveButton,
        appMenuBar,
        appContent,
        appStatusBar,
        appStatusBarImage,
        appStatusBarLabel,
        appLabel,
        that = this;

    appWindow = document.createElement('div');
    appWindow.setAttribute('class', 'appWindow');
    appWindow.setAttribute('style', 'height: ' + height + "px; width: " + width + "px;");
    appTitleBar = document.createElement('div');
    appTitleBar.setAttribute('class', 'appTitleBar');
    appTitleBarImage = document.createElement('img');
    appTitleBarImage.setAttribute('src', iconUrl);
    appTitleBarImage.setAttribute('class', 'appTitleBarIcon');
    appLabel = document.createElement('label');
    appLabel.setAttribute('class', 'appTitleBarLabel');
    appLabel.appendChild(document.createTextNode(name));
    appTitleBar.appendChild(appTitleBarImage);
    appTitleBar.appendChild(appLabel);
    appRemoveButtonAnchor = document.createElement('a');
    appRemoveButtonAnchor.setAttribute('class', 'appRemoveButtonAnchor');
    appRemoveButtonAnchor.setAttribute('href', '#');
    appRemoveButtonAnchor.setAttribute('alt', 'stäng fönster');

    appRemoveButtonAnchor.addEventListener('click', function (e) {
        var currentNode;

        e = e || event;

        currentNode = e.currentTarget; //appRemoveButtonAnchor-noden

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

    appTitleBar.addEventListener('mouseover', function (e) {
        e = e || event;
        appWindow.style.cursor = 'move';
        e.stopPropagation();
        e.preventDefault();
    }, false);

    appLabel.addEventListener('mouseover', function (e) {
        e = e || event;
        appWindow.style.cursor = 'move';
        e.stopPropagation();
        e.preventDefault();
    }, false);


    var oldCursorPositionX;
    var oldCursorPositionY;
    var testcount = 0;

    appWindow.addEventListener('mousedown', function (e) {
        var moveWindow;

        e = e || event;

        //if (appWindow.style.cursor === 'move') {
            oldCursorPositionX = e.clientX;
            oldCursorPositionY = e.clientY;
        //} //

        // else if
        moveWindow = function (e) {
            var leftPosition = appWindow.getBoundingClientRect().left,
                topPosition = appWindow.getBoundingClientRect().top;

            e = e || event;

            if (e.which === 1) {

                window.console.log("fönstret placeras");
                if (oldCursorPositionX && oldCursorPositionY) {
                    that.setPosition(leftPosition + e.clientX - oldCursorPositionX, topPosition + e.clientY - oldCursorPositionY);
                }
                window.console.log("oldCursorPositionX får nya koordinater.");
                oldCursorPositionX = e.clientX;
                oldCursorPositionY = e.clientY;
            } else {
                window.console.log("oldCursorPositionX sätts till noll (2)");
                oldCursorPositionX = undefined;
                oldCursorPositionY = undefined;
            }
            //e.stopPropagation();
            e.preventDefault();

        };

        var endMoveWindow = function (e) {
            e = e || event;

            window.console.log("mouseup körs...");
            document.removeEventListener('mousemove', moveWindow, false);
            window.console.log("oldCursorPositionX ( " + oldCursorPositionX + " ) sätts till undefined");
            oldCursorPositionX = undefined;
            oldCursorPositionY = undefined;
            e.stopPropagation();
            e.preventDefault();
        };
        document.addEventListener('mousemove', moveWindow, false);

        document.addEventListener('mouseup', endMoveWindow, false);

        e.stopPropagation();
        e.preventDefault();
    }, false);

    appWindow.addEventListener('mousemove', function (e) {
        var leftPosition = appWindow.getBoundingClientRect().left,
            rightPosition = appWindow.getBoundingClientRect().right,
            topPosition = appWindow.getBoundingClientRect().top,
            bottomPosition = appWindow.getBoundingClientRect().bottom;

        e = e || event;

        if (e.clientX >= leftPosition && e.clientX <= leftPosition + 2) {
            if (e.clientY >= topPosition && e.clientY <= topPosition + 20) {
                appWindow.style.cursor = 'nw-resize';
            }
            if (e.clientY <= bottomPosition && e.clientY >= bottomPosition - 20) {
                appWindow.style.cursor = 'sw-resize';
            } else {
                appWindow.style.cursor = 'w-resize';
            }
        } else if (e.clientX <= rightPosition + 4 && e.clientX  >= rightPosition + 2) {
            if (e.clientY >= topPosition && e.clientY <= topPosition + 20) {
                appWindow.style.cursor = 'ne-resize';
            } else if (e.clientY <= bottomPosition && e.clientY >= bottomPosition - 20) {
                appWindow.style.cursor = 'se-resize';
            } else {
                appWindow.style.cursor = 'e-resize';
            }
        } else if (e.clientY >= topPosition && e.clientY <= topPosition + 2) {
            if (e.clientX >= leftPosition && e.clientX <= leftPosition + 20) {
                appWindow.style.cursor = 'nw-resize';
            } else if (e.clientX <= rightPosition + 4 && e.clientX  >= rightPosition - 16) {
                appWindow.style.cursor = 'ne-resize';
            } else {
                appWindow.style.cursor = 'n-resize';
            }
        } else if (e.clientY <= bottomPosition && e.clientY >= bottomPosition - 2) {
            if (e.clientX >= leftPosition && e.clientX <= leftPosition + 20) {
                appWindow.style.cursor = 'sw-resize';
            } else if (e.clientX <= rightPosition + 4 && e.clientX  >= rightPosition - 16) {
                appWindow.style.cursor = 'se-resize';
            } else {
                appWindow.style.cursor = 's-resize';
            }
        } else if (e.target === appTitleBar || e.target === appLabel || e.target === appTitleBarImage) {
            appWindow.style.cursor = 'move';
        } else {
            appWindow.style.cursor = 'default';
        }
        //e.stopPropagation();
        e.preventDefault();
    }, false);

    //window.alert(this.getName);
    //if (this instanceof NS1DV403.Window) {
        //  window.alert("yep, Window");
        //}

    //if (this instanceof NS1DV403.ImageViewer) {
    //    window.alert("yep, ImageViewer");
    //}
    this.getAppWindow = function () {
        return appWindow;
    };

    this.setPosition = function (xPosition, yPosition) {
        window.console.log("position satt:" + xPosition  + ":" + yPosition);
        appWindow.style.left = xPosition + "px";
        appWindow.style.top = yPosition + "px";
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

    this.getTopLeftPositionX = function () {
        return appWindow.getBoundingClientRect().left;
    };

    this.getTopLeftPositionY = function () {
        return appWindow.getBoundingClientRect().top;
    };


};
