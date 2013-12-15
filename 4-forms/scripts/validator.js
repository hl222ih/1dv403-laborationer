"use strict";

window.onload = function () {
    var form = document.getElementById("payForm"),
        inputs = form.getElementsByTagName("input"),
        i;

    for (i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('keyup', function (e) { validate(e.target); }, false);
    }

    function validate(input) {
        var type = input.getAttribute("class"),
            text = input.value;

        function validated(text) {
            if (/^text/.test(type)) {
                return (text.trim().length > 0);
            }
            if (/^zipCode/.test(type)) {
                return (/^\d{5}$/.test(text.trim()));
            }
            if (/^email/.test(type)) {
                //väääldigt många regler att ta hänsyn till, så ganska omöjligt att få till det rätt.
                //Här har jag skapat ett regex jag skapat för att få med epostadresser som:
                //börjar på en bokstav och
                //som fortsätter med 0 eller flera bokstäver och/eller siffror )samt _) och
                //som _eventuellt_ fortsätter med en punkt och sedan en eller fler bokstäver och/eller siffror (samt _).
                //som sedan har ett @ och
                //som sedan har en eller två subdomäner (isåfall med punkt emellan)
                //som sedan följs av en punkt och sedan topptomänen som kan bestå av 2 till 6 bokstäver (a-z).
                //
                //Regexet är icke skiftlägeskänsligt.
                //
                //Regexet matchar alltså inte e-postadresser med internationella tecken.
                //Regexet matchar inte e-postadresser med siffor (ip-nummer).
                //+ en massa annat det inte matchar.
                //Det finns troligen "färdiga regex" som rekommenderas att man kan använda.
                return (/^[a-z][a-z0-9_\-]*(\.[a-z0-9_\-]+)?@([a-z0-9_\-]+\.){1,2}[a-z]{2,6}/i.test(text));
            }
        }

        if (validated(text) === true) {
            if (!/ validated/.test(input.getAttribute("class"))) {
                input.setAttribute("class", input.getAttribute("class") + " validated");
            }
        } else {
            if (/ validated/.test(input.getAttribute("class"))) {
                input.setAttribute("class", input.getAttribute("class").replace(/ validated/, ""));
            }
        }

    }

};