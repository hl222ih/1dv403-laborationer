"use strict";

var NS1DV403 = NS1DV403 || {};

NS1DV403.RssReader = function (height, width) {
    var xhr = new XMLHttpRequest(),
        timeOutId,
        that = this;
        //imageInfos,
        //imageWindows = [];

    NS1DV403.Window.call(this, height, width, 'RSS Reader', true, false, 'images/rss16.png');


    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                that.setStatusBarText("");
                that.hideWaitIcon();
                clearTimeout(timeOutId);
                //imageInfos = JSON.parse(xhr.responseText);
                //renderImages();
            } else {
                window.alert("Läsfel, status: " + xhr.status);
            }
            that.getAppWindow().style.cursor = "default";
        }
    };

    //timeOutId = setTimeout(function () {
    //    that.setStatusBarText("hämtar miniatyrbilder...");
    //    that.showWaitIcon();
    //    that.getAppWindow().style.cursor = "wait";
    //}, 300);

    //xhr.open('get', 'http://homepage.lnu.se/staff/tstjo/labbyServer/imgviewer/', true);
    //xhr.send(null);

    this.getType = function () {
        return 'RssReader';
    };

};