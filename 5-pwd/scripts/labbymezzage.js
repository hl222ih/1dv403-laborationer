"use strict";

var NS1DV403 = NS1DV403 || {};

NS1DV403.LabbyMezzage = function (height, width) {
    var that = this;

    NS1DV403.Window.call(this, height, width, 'LabbyMezzage', false, true, 'images/labby64.png');

    this.getType = function () {
        return 'LabbyMezzage';
    };

};