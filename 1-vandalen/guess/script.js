//Använder JSLint och JSHint.
//Avmarkerat varning för ++/-- och fördefiniering av browservariabler.
//Markerat att koden är enligt ES5-standard.
//Har ändrat några variabelnamn av tydlighetsskäl.

window.onload = function () {
    "use strict"; //JSLint vill att den ska placeras i funktionen.

    //deklarerar alla variabler i början på funktionen
    var secretNumber,       //det hemliga talet som ska försöka gissas (number)
        makeGuess,          //funktion som kontrollerar gissningen och returnerar ett svar (function)
        minValue,           //det lägsta talet som kan vara det hemliga talet
        maxValue,           //det högsta talet som kan vara det hemliga talet
        numberOfGuesses,    //antalet gjorda gissningar
        p,                  //Referens till DOM-noden med id="#value"
        input,              //Referens till DOM-noden med id="#input"
        submit;             //Referens till DOM-noden med id="#submit"

    //utgångsvärden
    minValue = 1;
    maxValue = 100;
    numberOfGuesses = 0;

    secretNumber = Math.floor(Math.random() * (maxValue - minValue) + 1) + minValue;

    makeGuess = function (guessed_number) {
        guessed_number = guessed_number.replace(/^0+/, ''); //tar bort eventuella inledande nollor
        guessed_number = parseInt(guessed_number, 10);

        if (guessed_number >= minValue && guessed_number <= maxValue) {

            numberOfGuesses++; //räknar bara upp antalet gissningar då en giltig gissning gjorts

            if (guessed_number < secretNumber) {
                return [false, "Det hemliga talet är större än " + guessed_number + "!"];
            }
            if (guessed_number > secretNumber) {
                return [false, "Det hemliga talet är mindre än " + guessed_number + "!"];
            }
            if (guessed_number === secretNumber) {
                return [true, "Grattis du vann! Det hemliga talet var " + secretNumber + " och du behövde " + numberOfGuesses + " gissningar för att hitta det."];
            }
        }
        return [false, "Kunde inte tolka gissningen. Försök igen. Du måste ange ett tal mellan " + minValue + " och " + maxValue];

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