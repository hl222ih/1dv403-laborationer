"use strict";

var NS1DV403 = NS1DV403 || {};

NS1DV403.ImageViewer = function (height, width, hasMenuBar) {
    var xhr = new XMLHttpRequest(),
        timeOutId,
        that = this,
        imageInfos;

    NS1DV403.Window.call(this, height, width, 'Image Viewer', hasMenuBar, true);

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
            anchorNode.appendChild(imgNode);

            anchorNode.addEventListener('click', function (e) {
                e = e || event;

                //visa information om objektet.

                e.preventDefault();
                e.stopPropagation();

            }, false);
            anchorNode.addEventListener('click', function (e) {
                e = e || event;

                //skapa nytt bildfönster

                e.preventDefault();
                e.stopPropagation();

            }, false);
            that.addToAppContent(anchorNode);
        }
    }

};