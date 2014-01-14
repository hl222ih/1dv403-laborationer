//memory64.png Murid Rahhal - http://blog.sfaranda.com Free for commercial use (Include link to authors website)
//labby64.png Murid Rahhal - http://blog.sfaranda.com Free for commercial use (Include link to authors website)
//rss64.png Maja Bencic - http://www.fritula.hr Creative Commons 3.0
//rss32.png Maja Bencic - http://www.fritula.hr Creative Commons 3.0
//0.png chrisbanks2 - http://chrisbanks2.deviantart.com CC Attribution-Noncommercial-No Derivate 3.0
//alla andra bilder helt fria eller helt fria för personligt bruk
"use strict";

//namnrymd för desktop-applikationen
var NS1DV403 = NS1DV403 || {};

window.onload = function () {
    var app = null,
        apps = [],
        desktop = document.getElementById('desktop'),
        taskbar = document.getElementById('taskbar'),
        iconAchors = [],
        icon,
        iconAnchor,
        setWindowPosition;

    function createImageViewer() {
        app = new NS1DV403.ImageViewer(300, 400, true);
        apps.push(app);
        desktop.appendChild(app.getAppWindow());
    }

    function createRssReader() {
        app = new NS1DV403.RssReader(400, 350);
        app.updateRssFeed(); //ok
        //app.updateRssFeed('https://news.google.se/news/feeds?pz=1&cf=all&ned=sv_se&hl=sv&topic=t&output=rss'); //failed = "Cannot read RSS data file."
        apps.push(app);
        desktop.appendChild(app.getAppWindow());
    }

    function createMemory() {
        app = new NS1DV403.Memory(346, 276);
        app.createNewGame(4, 4);
        apps.push(app);
        desktop.appendChild(app.getAppWindow());
    }

    function createLabbyMezzage() {
        app = new NS1DV403.LabbyMezzage(450, 300);
        apps.push(app);
        desktop.appendChild(app.getAppWindow());
    }

    if (window.localStorage.lastTime) {
        var date = new Date(parseInt(window.localStorage.lastTime));
        //window.alert('Välkommen tillbaka! (senast besökt: ' + date.toLocaleString() + ')');
    }



    var imageViewerEventHandler,
        createTaskBarElement,
        rssReaderEventHandler,
        memoryEventHandler,
        labbyMezzageEventHandler;

    imageViewerEventHandler = function (e) {
        e = e || event;
        createImageViewer();
        setWindowPosition(app);
        e.stopPropagation();
        e.preventDefault();
    };

    rssReaderEventHandler = function (e) {
        e = e || event;
        createRssReader();
        setWindowPosition(app);
        e.stopPropagation();
        e.preventDefault();
    };

    memoryEventHandler = function (e) {
        e = e || event;
        createMemory();
        setWindowPosition(app);
        e.stopPropagation();
        e.preventDefault();
    };

    labbyMezzageEventHandler = function (e) {
        e = e || event;
        createLabbyMezzage();
        setWindowPosition(app);
        e.stopPropagation();
        e.preventDefault();
    };

    createTaskBarElement = function (url, appName, func) {
        iconAnchor = document.createElement('a');
        iconAnchor.setAttribute('href', '#');
        iconAnchor.setAttribute('class', 'iconAnchor');
        iconAnchor.setAttribute('title', appName);

        iconAnchor.addEventListener('click', func, false);

        icon = document.createElement('img');
        icon.setAttribute('src', url);
        icon.setAttribute('class', 'icon');
        iconAnchor.appendChild(icon);
        taskbar.appendChild(iconAnchor);
    };

    createTaskBarElement('images/imageviewer72.png', 'Image Viewer', imageViewerEventHandler);
    createTaskBarElement('images/rss64.png', 'RSS Reader', rssReaderEventHandler);
    createTaskBarElement('images/memory64.png', 'Memory', memoryEventHandler);
    createTaskBarElement('images/labby64.png', 'Labby Mezzage', labbyMezzageEventHandler);


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
                x: apps[i].getLeftPosition(),
                y: apps[i].getTopPosition()
            };
            appPoints.push(point);
        }

        newPositionPoint = {
            x: 30,
            y: 110
        };

        if (app.getType() === 'RssReader') {
            newPositionPoint.x = 130;
        } else if (app.getType() === 'Memory') {
            newPositionPoint.x = 230;
        } else if (app.getType() === 'LabbyMezzage') {
            newPositionPoint.x = 330;
            newPositionPoint.y = 10;
        }

        var count = 0;
        while (count <= 100 && appPoints.some(function (point) {
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

            count++;
            if (count === 100) {
                newPositionPoint.y = 30;
                newPositionPoint.x = documentWidth / 2;
            }

        }

        app.setPosition(newPositionPoint.x, newPositionPoint.y);
        app.moveToTop();
    };

    if (window.localStorage.windowsPositionData) {
        var storedWindowData = JSON.parse(window.localStorage.windowsPositionData),
            i;

        for (i = 0; i < storedWindowData.length; i++) {
            if (storedWindowData[i].type === 'ImageViewer') {
                createImageViewer();
            } else if (storedWindowData[i].type === 'RssReader') {
                createRssReader();
            } else if (storedWindowData[i].type === 'LabbyMezzage') {
                createLabbyMezzage();
            } else if (storedWindowData[i].type === 'Memory') {
                createMemory();
            }

            app.resizeWindow(storedWindowData[i].w, storedWindowData[i].n, storedWindowData[i].e, storedWindowData[i].s);
            app.setZPosition(storedWindowData[i].z);
        }
    }

    document.addEventListener('selectstart', function (e) {
        e.preventDefault();
        return false;
    }, false);

    window.addEventListener('beforeunload', function (e) {
        var i,
            positionData,
            allPositionData = [];

        for (i = 0; i < apps.length; i++) {
            positionData = {};
            positionData.w = apps[i].getLeftPosition();
            positionData.n = apps[i].getTopPosition();
            positionData.e = apps[i].getRightPosition();
            positionData.s = apps[i].getBottomPosition();
            positionData.z = apps[i].getZPosition();
            positionData.type = apps[i].getType();
            if (!(positionData.w === 0 && positionData.n === 0 && positionData.e === 0 && positionData.s === 0)) {
                allPositionData.push(positionData);
            }
        }

        window.localStorage.windowsPositionData = JSON.stringify(allPositionData);
        window.localStorage.lastTime = Date.now();
    }, false);
};

