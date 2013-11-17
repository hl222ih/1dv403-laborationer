

window.onload = function() {
    "use strict";

    var p, input, submit, convertString;

    // I denna funktion ska du skriva koden för att hantera "spelet"
    convertString = function(str) {

        var str_array, i;

        if (str === "") {
            throw new Error("Skriv den text du vill konvertera i rutan!");
        }

        str_array = str.split('');

        for (i = 0; i < str_array.length; i++) {
            if (str_array[i] !== str_array[i].toUpperCase()) {
                str_array[i] = str_array[i].toUpperCase();
            } else if (str_array[i] !== str_array[i].toLowerCase()) {
                str_array[i] = str_array[i].toLowerCase();
            }
        }
        str = str_array.join('');
        str = str.replace(/a/gi, '#'); //byt ut alla a eller A mot #

        return str;
    };
    // ------------------------------------------------------------------------------


    // Kod för att hantera utskrift och inmatning. Denna ska du inte behöva förändra
    p = document.querySelector("#value"); // Referens till DOM-noden med id="#value"
    input = document.querySelector("#string");
    submit = document.querySelector("#send");

    // Vi kopplar en eventhanterare till formulärets skickaknapp som kör en anonym funktion.
    submit.addEventListener("click", function(e) {
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