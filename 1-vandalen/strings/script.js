

window.onload = function () {
    "use strict";
    var convertString,      //Funktion som konverterar en sträng och returnerar den. (function)
        p,                  //Referens till DOM-noden med id="#value"
        input,              //Referens till DOM-noden med id="#input"
        submit;             //Referens till DOM-noden med id="#submit"

    convertString = function (str) {

        var newString = "", //den formaterade textsträngen
            i;              //loop-index. (number)

        if (str === "") {
            throw new Error("Skriv den text du vill konvertera i rutan!");
        }

        for (i = 0; i < str.length; i++) {
            if (/a/gi.test(str[i])) {
                newString += '#';
            } else if (str[i] !== str[i].toUpperCase()) {
                newString += str[i].toUpperCase();
            } else if (str[i] !== str[i].toLowerCase()) {
                newString += str[i].toLowerCase();
            }
        }

        return newString;
    };
    // ------------------------------------------------------------------------------


    // Kod för att hantera utskrift och inmatning. Denna ska du inte behöva förändra
    p = document.querySelector("#value"); // Referens till DOM-noden med id="#value"
    input = document.querySelector("#string");
    submit = document.querySelector("#send");

    // Vi kopplar en eventhanterare till formulärets skickaknapp som kör en anonym funktion.
    submit.addEventListener("click", function (e) {
        var answer;

        e.preventDefault(); // Hindra formuläret från att skickas till servern. Vi hanterar allt på klienten.

        p.classList.remove("error");

        try {
            answer = convertString(input.value); // Läser in texten från textrutan och skickar till funktionen "convertString"
            p.innerHTML = answer;        // Skriver ut texten från arrayen som skapats i funktionen.    
        } catch (error) {
            p.classList.add("error"); // Växla CSS-klass, IE10+
            p.innerHTML = error.message;
        }

    });



};