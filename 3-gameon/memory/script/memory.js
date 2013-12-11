/*global RandomGenerator*/
"use strict";

window.onload = function () {
    var Rows = 4,
        Cols = 4,
        imageNumbers = RandomGenerator.getPictureArray(Rows, Cols);

    if ((Rows * Cols) % 2 !== 0) {
        throw new Error("Spelplanen måste ha ett jämnt antal brickor, justera antaler rader och kolumner.")
    }

    function renderHTMLTable() {
        var i,
            j,
            tbody = document.getElementsByTagName("tbody")[0],
            tr,
            td,
            a,
            img;

        for (i = 0; i < Rows; i++) {
            tr = document.createElement("tr");
            for (j = 0; j < Cols; j++) {
                td = document.createElement("td");
                a = document.createElement("a");
                img = document.createElement("img");
                img.setAttribute("src", "pics/" + imageNumbers[i * Cols + j] + ".png");
                a.appendChild(img);
                td.appendChild(a);
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
    }
    renderHTMLTable();

};