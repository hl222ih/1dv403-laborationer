"use strict";

var NS1DV403 = NS1DV403 || {};

NS1DV403.ImageViewer = function (height, width, hasMenuBar) {
    var xhr = new XMLHttpRequest(),
        timeOutId,
        that = this,
        imageInfos,
        imageWindows = [];

    NS1DV403.Window.call(this, height, width, 'Image Viewer', hasMenuBar, true, 'images/imageviewer16.png');

    //hämtar bilderna
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                that.setStatusBarText("");
                that.hideWaitIcon();
                clearTimeout(timeOutId);
                imageInfos = JSON.parse(xhr.responseText);
                renderImages();
            } else {
                window.alert("Läsfel, status: " + xhr.status);
            }
            that.getAppWindow().style.cursor = "default";
        }
    };

    timeOutId = setTimeout(function () {
        that.setStatusBarText("hämtar miniatyrbilder...");
        that.showWaitIcon();
        that.getAppWindow().style.cursor = "wait";
    }, 300);

    xhr.open('get', 'http://homepage.lnu.se/staff/tstjo/labbyServer/imgviewer/', true);
    xhr.send(null);

    function renderImages() {
        var i,
            anchorNode,
            imgNode;

        for (i = 0; i < imageInfos.length; i++) {
            anchorNode = document.createElement('a');
            anchorNode.setAttribute('class', 'thumbImageAnchor');
            anchorNode.setAttribute('href', '#');
            imgNode = document.createElement('img');
            imgNode.setAttribute('class', 'thumbImage');
            imgNode.setAttribute('src', imageInfos[i].thumbURL);
            imgNode.dataset.imageWidth = imageInfos[i].width.toString();
            imgNode.dataset.imageHeight = imageInfos[i].height.toString();
            imgNode.dataset.imageUrl = imageInfos[i].URL.toString();
            anchorNode.appendChild(imgNode);

            anchorNode.addEventListener('mouseenter', function (e) {
                var currentImage = e.currentTarget.getElementsByTagName('img')[0];

                e = e || event;

                that.setStatusBarText('dimensions: ' + currentImage.dataset.imageWidth + 'x' + currentImage.dataset.imageHeight + 'px');

                e.preventDefault();
                e.stopPropagation();

            }, false);
            anchorNode.addEventListener('click', function (e) {
                var currentImage = e.currentTarget.getElementsByTagName('img')[0],
                    imageWindow,
                    //imageWindows = [],
                    i,
                    point,
                    points = [],
                    newPositionPoint;

                e = e || event;

                imageWindow = new NS1DV403.ImageWindow(300, 300, currentImage.dataset.imageUrl,
                    that.getTopLeftPositionX(), that.getTopLeftPositionY());
                imageWindows.push(imageWindow);

                for (i = 0; i < imageWindows.length; i++) {
                    point = {
                        x: imageWindows[i].getTopLeftPositionX(),
                        y: imageWindows[i].getTopLeftPositionY()
                    };
                    points.push(point);
                }

                newPositionPoint = {
                    x: that.getTopLeftPositionX() + width + 30,
                    y: that.getTopLeftPositionY()
                };

                while (points.some(function (point) {
                        return (point.x === newPositionPoint.x && point.y === newPositionPoint.y);
                    })) {
                    newPositionPoint.x += 30;
                    newPositionPoint.y += 30;
                }

                imageWindow.setPosition(newPositionPoint.x, newPositionPoint.y);

                e.preventDefault();
                e.stopPropagation();

            }, false);
            that.addToAppContent(anchorNode);
        }
    }

};