function Message(text, date) {
    "use strict";
    this.getText = function () {
        return text;
    };
    this.setText = function (text) {
        this.text = text;
    };
    this.getDate = function () {
        return date;
    };
    this.setDate = function (date) {
        this.date = date;
    };
}

var padZero = function (number) {
    "use strict";
    window.console.log(number.length);
    return (number.toString().length === 1) ? "0" + number : number.toString();
};

Message.prototype.toString = function () {
    "use strict";
    return this.getText() + " (" + this.getDate() + ")";
};
Message.prototype.getHtmlText = function () {
    "use strict";
    return this.getText().replace(/\n/g, '<br />');
};
Message.prototype.getDateText = function () {
    "use strict";
    return this.getDate().getFullYear() + "-" + padZero((this.getDate().getMonth() + 1)) + "-" + padZero(this.getDate().getDate());
};
Message.prototype.getTimeText = function () {
    "use strict";
    return padZero(this.getDate().getHours()) + ":" + padZero(this.getDate().getMinutes()) + ":" + padZero(this.getDate().getSeconds());
};
Message.prototype.getFullDateText = function () {
    "use strict";
    return this.getDateText() + " " + this.getTimeText();
};


