window.onload = function () {
    "use strict";

    var getDaysLeftToBirthday,  //funktion som räknar ut och returnerar antalet återstående dagar till nästa födelsedag. (function)
        p,                      //Referens till DOM-noden med id="#value"
        input,                  //Referens till DOM-noden med id="#input"
        submit;                 //Referens till DOM-noden med id="#submit"

    getDaysLeftToBirthday = function (dateString) {
        var dateOfBirth,            //födelsedatum (Date object)
            yearOfBirth,            //födelseår (number)
            monthOfBirth,           //födelsemånad (number) januari = 1, december = 12.
            dayOfBirth,             //dag i månaden för födelsedagen (number)
            nextDateOfBirthday,     //datumet då nästa födelsedag infaller (Date object)
            currentDate,            //dagens datum (Date object)
            currentYear,            //aktuellt år (number)
            currentMonth,           //aktuell månad (number) januari = 1. december = 12.
            currentDayOfMonth,      //aktuell dag i månaden (number)
            daysLeftToNextBirthday, //återstående dagar till nästa födelsedag.
            regex,                  //regex för att testa att en sträng innehåller månad i formatet "YYYY-MM-DD".
            match;                  //grupp med matchningar från regexet (Array object)


        currentDate = new Date();
        currentYear = currentDate.getFullYear();
        currentMonth = currentDate.getMonth() + 1;
        currentDayOfMonth = currentDate.getDate();
        //Dagens datum med tid borttagen.
        currentDate = new Date(currentYear, currentMonth - 1, currentDayOfMonth);

        //För att matcha datum på formen YYYY-MM-DD där MM är 01-12 och DD är 01-31
        regex = /(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])/;
        try {
            match = regex.exec(dateString);
            yearOfBirth = parseInt(match[1].replace(/^0+/, ''), 10);
            monthOfBirth = parseInt(match[2].replace(/^0+/, ''), 10);
            dayOfBirth = parseInt(match[3].replace(/^0+/, ''), 10);
            //Date är 0-indexerat på månaden.
            dateOfBirth = new Date(yearOfBirth, monthOfBirth - 1, dayOfBirth);
        } catch (error) {
            throw new Error("Kunde inte tolka datumet.");
        }

        //Om ett datum anges med för många dagar, läggs de överskjutande
        //dagarna till nästkommande månad istället.
        //Kasta även ett fel om datum i februari är ogiltigt.
        //29/2 då det inte är skottår, 30/2 och 31/2.
        if (dateOfBirth.getMonth() + 1 !== monthOfBirth) {
            throw new Error("Kunde inte tolka datumet.");
        }

        //Kasta även ett fel om födelsedagen ligger framåt i tiden.
        //Testa om den angivna födelsedagen är längre fram i tiden än dagens datum.
        if (dateOfBirth > currentDate) {
            throw new Error("Ange ett födelsedatum tillbaka i tiden.");
        }

        //Nästa födelsedag innevarande år, men samma månad och dag i månaden som födelsedatumet.
        nextDateOfBirthday = new Date(currentYear, monthOfBirth - 1, dayOfBirth);

        //Om födelsedagen innevarande år redan inträffat, lägg till ett år
        //till nästa födelsedag.
        if (nextDateOfBirthday < currentDate) {
            nextDateOfBirthday.setFullYear(currentYear + 1);
        }

        //Räknar ut skillnaden mellan dagens datum och datumet för nästa födelsedag
        //och räknar om skillnaden från millisekunder till dagar.
        daysLeftToNextBirthday = (nextDateOfBirthday - currentDate) / 1000 / 60 / 60 / 24;

        //Ändring till/från normaltid ändrar tiden en timme.
        //Jusetera antalet dagar till att ange hela dagar.
        daysLeftToNextBirthday = Math.round(daysLeftToNextBirthday);

        return daysLeftToNextBirthday;

    };
    // ------------------------------------------------------------------------------


    // Kod för att hantera utskrift och inmatning. Denna ska du inte behöva förändra
    p = document.querySelector("#value"); // Referens till DOM-noden med id="#value"
    input = document.querySelector("#string");
    submit = document.querySelector("#send");

    // Vi kopplar en eventhanterare till formulärets skickaknapp som kör en anonym funktion.
    submit.addEventListener("click", function (e) {
        e.preventDefault(); // Hindra formuläret från att skickas till servern. Vi hanterar allt på klienten.

        p.classList.remove("error");

        try {
            var answer, message;

            answer = getDaysLeftToBirthday(input.value); // Läser in texten från textrutan och skickar till funktionen "convertString"

            switch (answer) {
            case 0:
                message = "Grattis på födelsedagen!";
                break;
            case 1:
                message = "Du fyller år imorgon!";
                break;
            default:
                message = "Du fyller år om " + answer + " dagar";
                break;
            }

            p.innerHTML = message;
        } catch (error) {
            p.classList.add("error"); // Växla CSS-klass, IE10+
            p.innerHTML = error.message;
        }
    });
};