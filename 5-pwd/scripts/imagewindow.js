"use strict";

var NS1DV403 = NS1DV403 || {};

NS1DV403.ImageWindow = function (height, width, url) {
    var desktop = document.getElementById('desktop'),
        appWindow,
        anchorNode,
        imgNode,
        i;

    NS1DV403.Window.call(this, height, width, 'Image', false, false, 'images/imageviewer24.png');

    appWindow = this.getAppWindow();
    anchorNode = document.createElement('a');
    anchorNode.setAttribute('class', 'imageAnchor');
    imgNode = document.createElement('img');
    imgNode.setAttribute('class', 'image');
    imgNode.setAttribute('src', url);
    anchorNode.appendChild(imgNode);
    this.addToAppContent(anchorNode);
    desktop.appendChild(appWindow);

    this.getType = function () {
        return 'ImageWindow';
    }
};