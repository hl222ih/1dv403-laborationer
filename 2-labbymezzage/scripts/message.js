function Message(text) {
    "use strict";

    var now = new Date();       //tidpunkt för objektets skapande.

    this.text = text;
    this.timestamp = now.getHours() + ":" + now.getMinutes();
}