var makePerson = function (persArr) {
    "use strict"; //blidkar JSLint

    //deklarerar alla funktionsvariabler.
    var all_names_array,    //alla namn i en array.
        all_names_string,   //alla namn i en sträng.
        all_ages,           //alla åldrar i en array.
        min_age,            //den lägsta åldern bland alla åldrar.
        max_age,            //den högsta åldern bland alla åldrar.
        average_age;        //genomsnittsåldern av alla åldrar.

    //kontrollerar att inputvärdet innehåller rätt format och kastar annars ett undantag med relevant information. Om flera olika fel finns nämns bara det först påträffade felet.
    if (!persArr instanceof Array) {
        throw new Error("Argumentet är inte en array-variabel.");
    }

    if (!persArr.every(function (person) {
            return (typeof person === 'object');
        })) {
        throw new Error("Argumentet är inte en array-variabel som uteslutande innehåller objekt.");
    }

    if (!persArr.every(function (person) {
            return person.hasOwnProperty('name');
        })) {
        throw new Error("Ett eller flera objekt i arrayen saknar en 'name'-property.");
    }

    if (!persArr.every(function (person) {
            return person.hasOwnProperty('age');
        })) {
        throw new Error("Ett eller flera objekt i arrayen saknar en 'age'-property.");
    }

    if (!persArr.every(function (person) {
            return (typeof person.name === 'string');
        })) {
        throw new Error("Ett eller flera objekt i arrayen saknar en 'name'-property av typen 'string'.");
    }

    if (!persArr.every(function (person) {
            return (typeof person.age === 'number');
        })) {
        throw new Error("Ett eller flera objekt i arrayen saknar en 'age'-property av typen 'number'.");
    }

    //Använder map för att skapa en ny array motsvarande persArr, men med objektens namn.
    all_names_array = persArr.map(function (person) {
        return person.name;
    });

    //En dator med svenska locale-inställningar sorterar å ä ö korrekt och för övriga bokstäver bortses från diakriter. toLowerCase() så att inte versaler och gemener sorteras för sig.
    all_names_array.sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });

    //Lägger samman namnen från vektorn till en sträng.
    all_names_string = all_names_array.join(', ');

    //Använder map för att skapa en array motsvarande persArr, men med objektens åldrar.
    all_ages = persArr.map(function (person) {
        return person.age;
    });

    //Math.min.apply(Math, array) känns som ett krångligt uttryck för en sådan enkel grej, men det verkar vara så man får göra...
    min_age = Math.min.apply(Math, all_ages);
    //Samma för min...
    max_age = Math.max.apply(Math, all_ages);

    //Använder reduce för att agera på alla objekt i arrayen, i par:
    //iteration 1: a och b: all_ages[0] och all_ages[1]
    //iteration 2: a och b: resultat från iteration 1 och all_ages[2]
    //osv.
    //Delar sedan resultatet med antalet åldrar för att få ut medelvärdet.
    average_age = all_ages.reduce(function (a, b) {
        return a + b;
    }) /  all_ages.length;

    //Avrundar medelvärdet för att test-caset vill ha ett heltal.
    average_age = Math.round(average_age);

    //Skapar och returnerar objektet med minAge, maxAge, averageAge och names.
    return {minAge: min_age, maxAge: max_age, averageAge: average_age, names: all_names_string};
};