var makePerson = function (persArr) {
    "use strict"; //blidkar JSLint

    //deklarerar alla funktionsvariabler.
    var allNamesArray,    //alla namn i en array.
        allNamesString,   //alla namn i en sträng.
        allAges,           //alla åldrar i en array.
        minAge,            //den lägsta åldern bland alla åldrar.
        maxAge,            //den högsta åldern bland alla åldrar.
        averageAge;        //genomsnittsåldern av alla åldrar.

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
    allNamesArray = persArr.map(function (person) {
        return person.name;
    });

    //En dator med svenska locale-inställningar sorterar å ä ö korrekt och för övriga bokstäver bortses från diakriter. toLowerCase() så att inte versaler och gemener sorteras för sig.
    allNamesArray.sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });

    //Lägger samman namnen från vektorn till en sträng.
    allNamesString = allNamesArray.join(', ');

    //Använder map för att skapa en array motsvarande persArr, men med objektens åldrar.
    allAges = persArr.map(function (person) {
        return person.age;
    });

    //Math.min.apply(Math, array) känns som ett krångligt uttryck för en sådan enkel grej, men det verkar vara så man får göra...
    minAge = Math.min.apply(Math, allAges);
    //Samma för min...
    maxAge = Math.max.apply(Math, allAges);

    //Använder reduce för att agera på alla objekt i arrayen, i par:
    //iteration 1: a och b: allAges[0] och allAges[1]
    //iteration 2: a och b: resultat från iteration 1 och allAges[2]
    //osv.
    //Delar sedan resultatet med antalet åldrar för att få ut medelvärdet.
    averageAge = allAges.reduce(function (a, b) {
        return a + b;
    }) /  allAges.length;

    //Avrundar medelvärdet för att test-caset vill ha ett heltal.
    averageAge = Math.round(averageAge);

    //Skapar och returnerar objektet med minAge, maxAge, averageAge och names.
    return {minAge: minAge, maxAge: maxAge, averageAge: averageAge, names: allNamesString};
};