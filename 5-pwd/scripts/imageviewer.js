"use strict";

var NS1DV403 = NS1DV403 || {};

NS1DV403.ImageViewer = function (height, width, hasMenuBar, hasStatusBar) {
    NS1DV403.Window.call(this, height, width, 'Image Viewer', hasMenuBar, hasStatusBar);
};

//Föreläsningens exempel (E13 0:38:00) funkar inte i verkligheten.
//NS1DV403.ImageViewer.prototype = new NS1DV403.Window();
//Både min och föreläsningens exempel har konstruktorer med parametrar inkluderade.

//Från föreläsningen, men verkar inte behövas...
//NS1DV403.ImageViewer.prototype = Object.create(NS1DV403.Window.prototype);
//NS1DV403.ImageViewer.prototype.getAppWindow = function () {
//    return this.getAppWindow();
//};