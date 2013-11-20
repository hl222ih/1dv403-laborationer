

window.onload = function () {
    "use strict";
    var convertString,      //Funktion som konverterar en sträng och returnerar den. (function)
        p,                  //Referens till DOM-noden med id="#value"
        input,              //Referens till DOM-noden med id="#input"
        submit;             //Referens till DOM-noden med id="#submit"

    convertString = function (str) {

        var strArray,       //variabeln str splittad till en array (Array object).
            i;              //loop-index. (number)

        if (str === "") {
            throw new Error("Skriv den text du vill konvertera i rutan!");
        }

        strArray = str.split('');

        for (i = 0; i < strArray.length; i++) {
            if (strArray[i] !== strArray[i].toUpperCase()) {
                strArray[i] = strArray[i].toUpperCase();
            } else if (strArray[i] !== strArray[i].toLowerCase()) {
                strArray[i] = strArray[i].toLowerCase();
            }
        }
        str = strArray.join('');
        str = str.replace(/a/gi, '#'); //byt ut alla a eller A mot #

        return str;
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