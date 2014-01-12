"use strict";

var NS1DV403 = NS1DV403 || {};

NS1DV403.Window = function (height, width, name, hasMenuBar, hasStatusBar, iconUrl, menuElements) {
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
        that = this,
        oldCursorPositionX,
        oldCursorPositionY,
        moveOrResizeType,
        appStatusBarResizeIcon;

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
    appRemoveButtonAnchor.setAttribute('title', 'stäng appen');

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
        appMenuBar.appendChild(menuElements);
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


        appStatusBarResizeIcon = document.createElement('img');
        appStatusBarResizeIcon.setAttribute('class', 'appStatusBarResizeIcon');
        appStatusBarResizeIcon.setAttribute('src', 'images/expand38x40.png');
        appStatusBar.appendChild(appStatusBarResizeIcon);
    }

    if (hasStatusBar && hasMenuBar) {
        appContent.style.height = 'calc(100% - 72px)';
    } else if (hasStatusBar || hasMenuBar) {
        appContent.style.height = 'calc(100% - 48px)';
    } else {
        appContent.style.height = 'calc(100% - 24px)';
    }

    appWindow.addEventListener('click', function (e) {
        that.moveToTop();
    }, false);

    appWindow.addEventListener('mousedown', function (e) {
        var moveOrResizeWindow,
            endMoveOrResizeWindow,
            reziseWindow;

        e = e || event;

        if (appWindow.style.cursor === 'pointer' || /^(?:[sn]?[we]|[sn])-resize$/.test(appWindow.style.cursor)) {
            oldCursorPositionX = e.clientX;
            oldCursorPositionY = e.clientY;
            if (appWindow.style.cursor === 'pointer') {
                appWindow.style.cursor = 'move';
            }
            moveOrResizeType = appWindow.style.cursor;
        }

        that.moveToTop();

        //denna funktion flyttar eller ändrar storleken på fönstret beroende på vilken muspekare som visades
        //när musknappen trycktes ned.
        moveOrResizeWindow = function (e) {
            var leftPosition = appWindow.getBoundingClientRect().left,
                topPosition = appWindow.getBoundingClientRect().top,
                rightPosition = appWindow.getBoundingClientRect().right,
                bottomPosition = appWindow.getBoundingClientRect().bottom,
                appWindowWidth = appWindow.getBoundingClientRect().width,
                appWindowHeight = appWindow.getBoundingClientRect().height,
                newLeftPosition,
                newTopPosition,
                newRightPosition,
                newBottomPosition,
                newWindowWidth,
                newWindowHeight,
                body = document.getElementsByTagName('body')[0],
                bodyLeft = body.getBoundingClientRect().left + 1,
                bodyTop = body.getBoundingClientRect().top + 1,
                bodyRight = body.getBoundingClientRect().right - 1,
                bodyBottom = body.getBoundingClientRect().bottom - 1;

            e = e || event;

            if (/^(?:move|[sn]?w-resize)$/.test(moveOrResizeType)) {
                newLeftPosition = leftPosition + e.clientX - oldCursorPositionX;
            } else {
                newLeftPosition = leftPosition;
            }

            if (/^(?:move|n[we]?-resize)$/.test(moveOrResizeType)) {
                newTopPosition = topPosition + e.clientY - oldCursorPositionY;
            } else {
                newTopPosition = topPosition;
            }

            if (moveOrResizeType === 'move') {
                newRightPosition = leftPosition + e.clientX - oldCursorPositionX + appWindowWidth;
                newBottomPosition = topPosition + e.clientY - oldCursorPositionY + appWindowHeight;
            } else {
                if (/^[sn]?e-resize$/.test(moveOrResizeType)) {
                    newRightPosition = rightPosition + e.clientX - oldCursorPositionX;
                } else {
                    newRightPosition = rightPosition;
                }

                if (/^s[ew]?-resize$/.test(moveOrResizeType)) {
                    newBottomPosition = bottomPosition + e.clientY - oldCursorPositionY;
                } else {
                    newBottomPosition = bottomPosition;
                }
            }

            var MinWidth = 240;
            var MinHeight = 240;
            //e.which === 1: kolla att vänster musknapp är nedtryckt.
            if (e.which === 1) {
                if (oldCursorPositionX && oldCursorPositionY) {
                    if (newLeftPosition > leftPosition + 100) {
                        var breakHere = "";
                    }
                    if (newLeftPosition < bodyLeft) {
                        newLeftPosition = bodyLeft;
                        newRightPosition = bodyLeft + appWindowWidth;
                    } else if (newLeftPosition > newRightPosition - MinWidth) {
                        if (newRightPosition < rightPosition) { //förminskar vänster
                            newRightPosition = rightPosition;
                        } else { //förminskar höger
                            newLeftPosition = rightPosition - MinWidth;
                        }
                    } else if (newRightPosition > bodyRight) {
                        newLeftPosition = bodyRight - appWindowWidth;
                        newRightPosition = bodyRight;
                    } else if (newRightPosition < newLeftPosition + MinWidth) {
                        if (newLeftPosition < leftPosition) { //förminskar vänster
                            newLeftPosition = leftPosition;
                        } else { //förminskar höger
                            newRightPosition = leftPosition + MinWidth;
                        }
                    } else {
                        oldCursorPositionX = e.clientX;
                    }
                    if (newTopPosition < bodyTop) {
                        newTopPosition = bodyTop;
                        newBottomPosition = bodyTop + appWindowHeight;
                    } else if (newTopPosition > newBottomPosition - MinHeight) {
                        if (newBottomPosition < bottomPosition) { //förminskar uppåt
                            newBottomPosition = bottomPosition;
                        } else { //förminskar nedåt
                            newTopPosition = bottomPosition - MinHeight;
                        }
                    } else if (newBottomPosition > bodyBottom) {
                        newTopPosition = bodyBottom - appWindowHeight;
                        newBottomPosition = bodyBottom;
                    } else if (newBottomPosition < newTopPosition + MinHeight) {
                        if (newTopPosition < topPosition) { //förminskar nedåt
                            newTopPosition = topPosition;
                        } else { //förminskar uppåt
                            newBottomPosition = topPosition + MinHeight;
                        }
                    } else {
                        oldCursorPositionY = e.clientY;
                    }
                    that.resizeWindow(newLeftPosition, newTopPosition, newRightPosition, newBottomPosition);
                }
            } else {
                //nollställ muspekarpositionen när vänster musknapp inte längre är nedtryckt.
                oldCursorPositionX = undefined;
                oldCursorPositionY = undefined;
            }
            e.preventDefault();

        };

        endMoveOrResizeWindow = function (e) {
            e = e || event;

            document.removeEventListener('mousemove', moveOrResizeWindow, false);
            document.removeEventListener('mouseup', endMoveOrResizeWindow, false);

            oldCursorPositionX = undefined;
            oldCursorPositionY = undefined;
            moveOrResizeType = 'default';
            e.stopPropagation();
            e.preventDefault();
        };

        document.addEventListener('mousemove', moveOrResizeWindow, false);
        document.addEventListener('mouseup', endMoveOrResizeWindow, false);

        e.stopPropagation();
        //e.preventDefault(); Denna måste vara inaktiverad så att man kan klicka i inställningar.
    }, false);

    //Denna funktion sätter muspekaren till olika typer när den dras över fönstrets kanter.
    appWindow.addEventListener('mousemove', function (e) {
        //var leftPosition = appWindow.getBoundingClientRect().left,
        //    rightPosition = appWindow.getBoundingClientRect().right,
        //    topPosition = appWindow.getBoundingClientRect().top,
        //    bottomPosition = appWindow.getBoundingClientRect().bottom;
        var leftPosition = appWindow.offsetLeft,
            rightPosition = appWindow.offsetLeft + appWindow.offsetWidth,
            topPosition = appWindow.offsetTop,
            bottomPosition = appWindow.offsetTop + appWindow.offsetHeight;

        e = e || event;
        if (e.which !== 1) {
            if (e.clientX >= leftPosition && e.clientX <= leftPosition + 4) {
                if (e.clientY >= topPosition && e.clientY <= topPosition + 20) {
                    appWindow.style.cursor = 'nw-resize';
                } else if (e.clientY <= bottomPosition && e.clientY >= bottomPosition - 20) {
                    appWindow.style.cursor = 'sw-resize';
                } else {
                    appWindow.style.cursor = 'w-resize';
                }
            } else if (e.clientX <= rightPosition + 4 && e.clientX  >= rightPosition + 2) {
                if (e.clientY >= topPosition && e.clientY <= topPosition + 20) {
                    appWindow.style.cursor = 'ne-resize';
                } else if (e.clientY <= bottomPosition + 4 && e.clientY >= bottomPosition - 20) {
                    appWindow.style.cursor = 'se-resize';
                } else {
                    appWindow.style.cursor = 'e-resize';
                }
            } else if (e.clientY >= topPosition && e.clientY <= topPosition + 4) {
                if (e.clientX >= leftPosition && e.clientX <= leftPosition + 20) {
                    appWindow.style.cursor = 'nw-resize';
                } else if (e.clientX <= rightPosition + 4 && e.clientX  >= rightPosition - 16) {
                    appWindow.style.cursor = 'ne-resize';
                } else {
                    appWindow.style.cursor = 'n-resize';
                }
            } else if (e.clientY <= bottomPosition && e.clientY >= bottomPosition - 4) {
                if (e.clientX >= leftPosition && e.clientX <= leftPosition + 20) {
                    appWindow.style.cursor = 'sw-resize';
                } else if (e.clientX <= rightPosition + 4 && e.clientX  >= rightPosition - 16) {
                    appWindow.style.cursor = 'se-resize';
                } else {
                    appWindow.style.cursor = 's-resize';
                }
            } else if (e.target === appTitleBar || e.target === appLabel || e.target === appTitleBarImage) {
                if (e.which === 1) {
                    appWindow.style.cursor = 'move';
                } else {
                    appWindow.style.cursor = 'pointer';
                }
            } else if (e.target === appStatusBarResizeIcon) {
                appWindow.style.cursor = 'se-resize';
            } else {
                appWindow.style.cursor = 'default';
            }
        }
        e.preventDefault();
    }, false);

    this.getAppWindow = function () {
        return appWindow;
    };

    this.setPosition = function (xPosition, yPosition) {
        appWindow.style.left = xPosition + 'px';
        appWindow.style.top = yPosition + 'px';
    };

    this.resizeWindow = function (leftPosition, topPosition, rightPosition, bottomPosition) {
        appWindow.style.left = leftPosition + 'px';
        appWindow.style.top = topPosition + 'px';
        appWindow.style.width = (rightPosition - leftPosition) + 'px';
        appWindow.style.height = (bottomPosition - topPosition) + 'px';
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

    this.clearAppContent = function () {
        while (appContent.firstChild) {
            appContent.removeChild(appContent.firstChild);
        }
    };

    this.getLeftPosition = function () {
        return appWindow.getBoundingClientRect().left;
    };

    this.getTopPosition = function () {
        return appWindow.getBoundingClientRect().top;
    };

    this.getZPosition = function () {
        return appWindow.style.zIndex;
    };

    this.setZPosition = function (zIndex) {
        appWindow.style.zIndex = zIndex;
    };

    this.getRightPosition = function () {
        return appWindow.getBoundingClientRect().right;
    };

    this.getBottomPosition = function () {
        return appWindow.getBoundingClientRect().bottom;
    };

    this.moveToTop = function () {
        var windows = document.getElementsByClassName('appWindow'),
            currentTopZIndex = 0,
            i;

        for (i = 0; i < windows.length; i++) {
            if (windows[i].style.zIndex > currentTopZIndex) {
                currentTopZIndex = parseInt(windows[i].style.zIndex, 10);
            }
        }

        appWindow.style.zIndex = currentTopZIndex + 1;
    };


};
