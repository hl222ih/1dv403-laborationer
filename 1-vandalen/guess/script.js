//Använder JSLint och JSHint.
//Avmarkerat varning för ++/-- och fördefiniering av browservariabler.
//Markerat att koden är enligt ES5-standard.
//Har kikat lite på naming conventions: http://www.j-io.org/Javascript-Naming_Conventions/.
//Har ändrat några variabelnamn av tydlighetsskäl.

window.onload = function () {
    "use strict"; //JSLint vill att den ska placeras i funktionen.

    //deklarerar alla variabler i början på funktionen
    var secret_number, makeGuess, p, input, submit, min_value, max_value, number_of_guesses;

    min_value = 1; //det lägsta talet som kan vara det hemliga talet
    max_value = 100; //det högsta talet som kan vara det hemliga talet
    number_of_guesses = 0; //antalet gjorda gissningar

    secret_number = Math.floor(Math.random() * (max_value - min_value) + 1) + min_value;

    makeGuess = function (guessed_number) {
        guessed_number = guessed_number.replace(/^0+/, ''); //tar bort eventuella inledande nollor
        guessed_number = parseInt(guessed_number, 10);

        if (guessed_number >= min_value && guessed_number <= max_value) {

            number_of_guesses++; //räknar bara upp antalet gissningar då en giltig gissning gjorts

            if (guessed_number < secret_number) {
                return [false, "Det hemliga talet är större än " + guessed_number + "!"];
            }
            if (guessed_number > secret_number) {
                return [false, "Det hemliga talet är mindre än " + guessed_number + "!"];
            }
            if (guessed_number === secret_number) {
                return [true, "Grattis du vann! Det hemliga talet var " + secret_number + " och du behövde " + number_of_guesses + " gissningar för att hitta det."];
            }
        }
        return [false, "Kunde inte tolka gissningen. Försök igen. Du måste ange ett tal mellan " + min_value + " och " + max_value];

    };

    // ------------------------------------------------------------------------------



    // Kod för att hantera utskrift och inmatning. Denna ska du inte behöva förändra
    p = document.querySelector("#value"); // Referens till DOM-noden med id="#value"
    input = document.querySelector("#number");
    submit = document.querySelector("#send");

    // Vi kopplar en eventhanterare till formulärets skickaknapp som kör en anonym funktion.
    submit.addEventListener("click", function (e) {
        e.preventDefault(); // Hindra formuläret från att skickas till servern. Vi hanterar allt på klienten.

        var answer = makeGuess(input.value); // Läser in talet från textrutan och skickar till funktionen "guess"
        p.innerHTML = answer[1];        // Skriver ut texten från arrayen som skapats i funktionen.    

        if (answer[0] === true) {                // Om spelet är slut, avaktivera knappen.
            submit.disabled = true;
        }
    });
};