"use strict";

//namnrymd för desktop-applikationen
var NS1DV403 = NS1DV403 || {};

window.onload = function () {
    var app,
        apps = [],
        desktop = document.getElementById('desktop'),
        taskbar = document.getElementById('taskbar'),
        iconAchors = [],
        icon,
        iconAnchor,
        setWindowPosition;

    if (window.localStorage.lastTime) {
        var date = new Date(parseInt(window.localStorage.lastTime));
        window.alert('Välkommen tillbaka! (senast besökt: ' + date.toLocaleString() + ')');
    }

    iconAnchor = document.createElement('a');
    iconAnchor.setAttribute('href', '#');
    iconAnchor.setAttribute('class', 'iconAnchor');
    iconAnchor.setAttribute('title', 'ImageViewer');

    iconAnchor.addEventListener('click', function (e) {
        e = e || event;
        app = new NS1DV403.ImageViewer(300, 400, true);
        apps.push(app);
        desktop.appendChild(app.getAppWindow());
        setWindowPosition(app);
        e.stopPropagation();
        e.preventDefault();
    }, false);

    icon = document.createElement('img');
    icon.setAttribute('src', 'images/imageviewer72.png');
    icon.setAttribute('class', 'icon');
    iconAnchor.appendChild(icon);
    taskbar.appendChild(iconAnchor);

    setWindowPosition = function (app) {
        var appWindow = app.getAppWindow(),
            documentHeight = document.body.clientHeight,
            documentWidth = document.body.clientWidth,
            appWindowHeight = appWindow.offsetHeight,
            appWindowWidth = appWindow.offsetWidth,
            appWindowTopLeftPositionX = appWindow.getBoundingClientRect().left,
            appWindowTopLeftPositionY = appWindow.getBoundingClientRect().top,
            i,
            point,
            appPoints = [],
            newPositionPoint;

        for (i = 0; i < apps.length; i++) {
            point = {
                x: apps[i].getTopLeftPositionX(),
                y: apps[i].getTopLeftPositionY()
            };
            appPoints.push(point);
        }

        newPositionPoint = {
            x: 30,
            y: 110
        };

        while (appPoints.some(function (point) {
                return (point.x === newPositionPoint.x && point.y === newPositionPoint.y);
            })) {
            newPositionPoint.x += 30;
            newPositionPoint.y += 30;
            if (documentHeight < newPositionPoint.y + appWindowHeight) {
                newPositionPoint.y = 0;
            }
            if (documentWidth < newPositionPoint.x + appWindowWidth) {
                newPositionPoint.x = 0;
                newPositionPoint.y = 0;
            }
        }

        app.setPosition(newPositionPoint.x, newPositionPoint.y);

    };

    document.addEventListener('selectstart', function (e) {
        e.preventDefault();
        return false;
    }, false);

    window.addEventListener('beforeunload', function (e) {
        var desktopState;
        window.localStorage.lastTime = Date.now();
    }, false);
};

