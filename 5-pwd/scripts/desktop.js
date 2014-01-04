"use strict";

//namnrymd för desktop-applikationen
var NS1DV403 = NS1DV403 || {};

window.onload = function () {
    var //app = new NS1DV403.Window(200, 400, "yay", true, true),
        app = new NS1DV403.ImageViewer(200, 400, true, true),
        desktop = document.getElementById('desktop');

    desktop.appendChild(app.getAppWindow());
};