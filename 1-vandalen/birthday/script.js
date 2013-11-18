window.onload = function() {
    "use strict";

    var getDaysLeftToBirthday, p, input, submit, regex, match;

    getDaysLeftToBirthday = function(dateString) {
        var date_of_birth, year_of_birth, month_of_birth, day_of_birth, next_date_of_birthday, current_date, current_year, current_month, current_day_of_month, days_left_to_next_birthday;

        current_date = new Date();
        current_year = current_date.getFullYear();
        current_month = current_date.getMonth() + 1;
        current_day_of_month = current_date.getDate();
        //Dagens datum med tid borttagen.
        current_date = new Date(current_year, current_month - 1, current_day_of_month);

        //För att matcha datum på formen YYYY-MM-DD där MM är 01-12 och DD är 01-31
        regex = /(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])/;
        try {
            match = regex.exec(dateString);
            year_of_birth = parseInt(match[1].replace(/^0+/, ''), 10);
            month_of_birth = parseInt(match[2].replace(/^0+/, ''), 10);
            day_of_birth = parseInt(match[3].replace(/^0+/, ''), 10);
            //Date är 0-indexerat på månaden.
            date_of_birth = new Date(year_of_birth, month_of_birth - 1, day_of_birth);
        } catch (error) {
            throw new Error("Kunde inte tolka datumet.");
        }

        //Om ett datum anges med för många dagar, läggs de överskjutande
        //dagarna till nästkommande månad istället.
        //Kasta även ett fel om datum i februari är ogiltigt.
        //29/2 då det inte är skottår, 30/2 och 31/2.
        if (date_of_birth.getMonth() + 1 !== month_of_birth) {
            throw new Error("Kunde inte tolka datumet.");
        }

        //Kasta även ett fel om födelsedagen ligger framåt i tiden.
        //Testa om den angivna födelsedagen är längre fram i tiden än dagens datum.
        if (date_of_birth > current_date) {
            throw new Error("Ange ett födelsedatum tillbaka i tiden.");
        }

        //Nästa födelsedag innevarande år, men samma månad och dag i månaden som födelsedatumet.
        next_date_of_birthday = new Date(current_year, month_of_birth - 1, day_of_birth);

        //Om födelsedagen innevarande år redan inträffat, lägg till ett år
        //till nästa födelsedag.
        if (next_date_of_birthday < current_date) {
            next_date_of_birthday.setFullYear(current_year + 1);
        }

        //Räknar ut skillnaden mellan dagens datum och datumet för nästa födelsedag
        //och räknar om skillnaden från millisekunder till dagar.
        days_left_to_next_birthday = (next_date_of_birthday - current_date) / 1000 / 60 / 60 / 24;

        //Ändring till/från normaltid ändrar tiden en timme.
        //Jusetera antalet dagar till att ange hela dagar.
        days_left_to_next_birthday = Math.round(days_left_to_next_birthday);

        return days_left_to_next_birthday;

    };
    // ------------------------------------------------------------------------------


    // Kod för att hantera utskrift och inmatning. Denna ska du inte behöva förändra
    p = document.querySelector("#value"); // Referens till DOM-noden med id="#value"
    input = document.querySelector("#string");
    submit = document.querySelector("#send");

    // Vi kopplar en eventhanterare till formulärets skickaknapp som kör en anonym funktion.
    submit.addEventListener("click", function(e) {
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