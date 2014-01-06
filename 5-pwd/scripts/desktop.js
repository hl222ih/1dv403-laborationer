"use strict";

//namnrymd för desktop-applikationen
var NS1DV403 = NS1DV403 || {};

window.onload = function () {
    var app,
        //app2 = new NS1DV403.ImageViewer(300, 200, true),
        apps = [],
        desktop = document.getElementById('desktop'),
        taskbar = document.getElementById('taskbar'),
        iconAchors = [],
        icon,
        iconAnchor,
        setWindowPosition;

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
            documenHeight = document.body.clientHeight,
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
        }

        app.setPosition(newPositionPoint.x, newPositionPoint.y);

    };
};