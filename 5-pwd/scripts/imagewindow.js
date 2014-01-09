"use strict";

var NS1DV403 = NS1DV403 || {};

NS1DV403.ImageWindow = function (height, width, url) {
    var desktop = document.getElementById('desktop'),
        appWindow,
        anchorNode,
        imgNode,
        i,
        that = this,
        defaultHeight = height,
        defaultWidth = width;

    this.imageHeight = parseFloat(height);
    this.imageWidth = parseFloat(width);


    if (this.imageHeight > desktop.getBoundingClientRect().height * 0.80) {
        defaultHeight = desktop.getBoundingClientRect().height * 0.80;
        defaultWidth = defaultWidth * defaultHeight / this.imageHeight;
    }
    if (this.imageWidth > desktop.getBoundingClientRect().width * 0.60) {
        defaultWidth = desktop.getBoundingClientRect().width * 0.60;
        defaultHeight = defaultHeight * defaultWidth / this.imageWidth;
    }
    NS1DV403.Window.call(this, Math.floor(defaultHeight) + 24, Math.floor(defaultWidth), 'Image', false, false, 'images/imageviewer16.png');

    appWindow = this.getAppWindow();
    anchorNode = document.createElement('a');
    anchorNode.setAttribute('class', 'imageAnchor');
    imgNode = document.createElement('img');
    imgNode.setAttribute('class', 'image');
    imgNode.setAttribute('src', url);
    anchorNode.appendChild(imgNode);
    this.addToAppContent(anchorNode);
    desktop.appendChild(appWindow);
    appWindow.getElementsByClassName('appContent')[0].setAttribute('class', 'appWindowContent');

    this.getType = function () {
        return 'ImageWindow';
    };
};