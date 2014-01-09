"use strict";

var NS1DV403 = NS1DV403 || {};

NS1DV403.ImageViewer = function (height, width, hasMenuBar) {
    var xhr = new XMLHttpRequest(),
        timeOutId,
        that = this,
        imageInfos,
        imageWindows = [],
        greatestThumbWidth = 0,
        greatestThumbHeight = 0;

    NS1DV403.Window.call(this, height, width, 'Image Viewer', false, true, 'images/imageviewer16.png');

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
                window.alert("Kunde inte hämtas: " + xhr.status);
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
            if (greatestThumbHeight < imageInfos[i].thumbHeight) {
                greatestThumbHeight = imageInfos[i].thumbHeight;
            }

            if (greatestThumbWidth < imageInfos[i].thumbWidth) {
                greatestThumbWidth = imageInfos[i].thumbWidth;
            }
        }
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
            if ((imageInfos[i].thumbWidth / imageInfos[i].thumbHeight) > (greatestThumbWidth / greatestThumbHeight)) {
                imgNode.style.width = greatestThumbWidth + 'px';
                imgNode.style.height = greatestThumbWidth / (imageInfos[i].thumbWidth / imageInfos[i].thumbHeight) + 'px';
            } else {
                imgNode.style.height = greatestThumbHeight + 'px';
                imgNode.style.width = greatestThumbHeight * (imageInfos[i].thumbWidth / imageInfos[i].thumbHeight) + 'px';
            }
            imgNode.style.marginLeft = (greatestThumbWidth - parseFloat(imgNode.style.width.replace('px', ''))) / 2 + 12 + 'px';
            imgNode.style.marginRight = imgNode.style.marginLeft;
            imgNode.style.marginTop = (greatestThumbHeight - parseFloat(imgNode.style.height.replace('px', ''))) / 2 + 12 + 'px';
            imgNode.style.marginBottom = imgNode.style.marginTop;
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
                    i,
                    point,
                    points = [],
                    newPositionPoint,
                    body = document.getElementsByTagName('body')[0],
                    bodyHeight = body.getBoundingClientRect().height,
                    bodyWidth = body.getBoundingClientRect().width,
                    imageWindowHeight,
                    imageWindowWidth;

                e = e || event;

                imageWindow = new NS1DV403.ImageWindow(currentImage.dataset.imageHeight, currentImage.dataset.imageWidth, currentImage.dataset.imageUrl);
                imageWindows.push(imageWindow);

                imageWindowHeight = imageWindow.getAppWindow().getBoundingClientRect().height;
                imageWindowWidth = imageWindow.getAppWindow().getBoundingClientRect().width;

                for (i = 0; i < imageWindows.length; i++) {
                    point = {
                        x: imageWindows[i].getLeftPosition(),
                        y: imageWindows[i].getTopPosition()
                    };
                    points.push(point);
                }

                newPositionPoint = {
                    x: that.getLeftPosition() + width + 30,
                    y: that.getTopPosition()
                };

                while (points.some(function (point) {
                        return (point.x === newPositionPoint.x && point.y === newPositionPoint.y);
                    })) {
                    newPositionPoint.x += 30;
                    newPositionPoint.y += 30;
                    if (bodyHeight < newPositionPoint.y + imageWindowHeight) {
                        newPositionPoint.y = 0;
                    }
                    if (bodyWidth < newPositionPoint.x + imageWindowWidth) {
                        newPositionPoint.x = 0;
                        newPositionPoint.y = 0;
                    }
                }

                imageWindow.setPosition(newPositionPoint.x, newPositionPoint.y);

                e.preventDefault();
                e.stopPropagation();

            }, false);
            that.addToAppContent(anchorNode);
        }
    }

    this.getType = function () {
        return 'ImageViewer';
    };

};