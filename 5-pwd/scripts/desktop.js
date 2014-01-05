"use strict";

//namnrymd för desktop-applikationen
var NS1DV403 = NS1DV403 || {};

window.onload = function () {
    var app = new NS1DV403.ImageViewer(300, 400, true),
        desktop = document.getElementById('desktop');

    desktop.appendChild(app.getAppWindow());
    //app.setStatusBarText("Testar");
    app.setPosition(250, 400);
};