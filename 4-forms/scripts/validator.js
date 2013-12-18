"use strict";

window.onload = function () {
    var form = document.getElementById("payForm"), //<form>-noden
        inputs = form.getElementsByTagName("input"), //alla input-element i <form>
        labels = form.getElementsByTagName("label"), //alla label-element i <form>
        inputAndSelects = form.querySelectorAll("input, select"), //alla input- och select-element i <form>
        formSubmitButton = document.getElementById("submitButton"),//<form>-knappen som i utgångsläget är av submit-type.
        i; //for-loop counter.

    formSubmitButton.setAttribute("type", "button"); //denna körs bara om javascriptet är enabled, och byter då ut den befintliga submit-button mot en vanlig button som öppnar den modala popuprutan.

    for (i = 0; i < inputs.length; i++) {
        //validera respektive input-element på "keyup"
        inputs[i].addEventListener('keyup', function (e) {
            validate(e.target, false);
        }, false);
        //validera respektive input-element på "blur"
        inputs[i].addEventListener('blur', function (e) {
            if (!validate(e.target, true)) {
                displayFailedValidation(e.target);
            }
        }, false);
        //ta bort felmeddelande för respektive input-element på "focus"
        inputs[i].addEventListener('focus', function (e) {
            removeErrorMessage(e.target);
        }, false);
    }

    formSubmitButton.addEventListener("click", function (e) {
        var allValidated = true; //är alla input-element validerade? sätts till false på första förekomsten av misslyckad validering

        for (i = 0; i < inputs.length; i++) {
            //visa felmeddelande på första input-elementet (av potentiellt flera) felaktiga.
            if (!validate(inputs[i], true)) {
                if (allValidated) {
                    displayFailedValidation(inputs[i]);
                }
                allValidated = false;
            }
        }
        //skapar och visar modal popup-ruta om alla input-element är validerade.
        if (allValidated) {
            createModalPopup();
        }
    }, false);


    //skapar och visar modal popup-ruta
    function createModalPopup() {
        var header = document.createElement("h2"), //<header>-noden
            i, //for-loop-counter
            div, //generisk div för presentation av alla input id-value-par.
            popup = document.getElementById("popup"), //popup-noden
            id, //generisk input-id
            value, //generisk input-value
            fullDim = document.getElementById("fullDim"), //fullDim-noden
            //labels = form.getElementsByTagName("label"),
            submitButton, //popup-rutans submit-knapp
            cancelButton, //popup-rutans avbryt-knapp
            headerText = document.createTextNode("Bekräfta uppgifter"); //header-text


        //sätter fullDim till class: display så att den visas.
        addAttributeValueIfNotExists(fullDim, "class", "display");

        //lägger till innehållet till popuprutan.
        header.appendChild(headerText);
        popup.appendChild(header);
        for (i = 0; i < inputAndSelects.length; i++) {
            div = document.createElement("div");
            div.setAttribute("class", "confirm");
            id = labels[i].firstChild.nodeValue;
            if (inputAndSelects[i].nodeName === "INPUT") {
                value = inputAndSelects[i].value;
            } else if (inputAndSelects[i].nodeName === "SELECT") {
                value = inputAndSelects[i].options[inputAndSelects[i].selectedIndex].text;
            }
            div.appendChild(document.createTextNode(id + ": " + value));
            popup.appendChild(div);
        }
        submitButton = document.createElement("button");
        submitButton.setAttribute("id", "popupSubmitButton");
        submitButton.appendChild(document.createTextNode("Skicka!"));
        cancelButton = document.createElement("button");
        cancelButton.setAttribute("id", "popupCancelButton");
        cancelButton.appendChild(document.createTextNode("Avbryt"));
        popup.appendChild(submitButton);
        popup.appendChild(cancelButton);
        submitButton.addEventListener("click", function (e) {
            //tillgänglig gör form för att komma åt formulärets värden före submit.
            enableForm();
            form.submit(); //skickar iväg formuläret till php-fil.
            removeModalPopup(fullDim, popup);
            e.preventDefault();
        }, false);
        cancelButton.addEventListener("click", function () {
            removeModalPopup(fullDim, popup);
        }, false);
        disableForm();
    }

    //tar bort innehåll från modal popupruta och gömmer "containern"
    function removeModalPopup(fullDim, popup) {
        while (popup.firstChild !== null) {
            popup.removeChild(popup.firstChild);
        }
        removeAttributeValueIfExists(fullDim, "class", "display");
        enableForm();
    }

    //gör <form>-elementets input- och selectelement åtkomliga
    function enableForm() {
        var i;

        for (i = 0; i < inputAndSelects.length; i++) {
            inputAndSelects[i].removeAttribute("disabled");
        }
    }

    //gör <form>-elementets input- och selectelement oåtkomliga
    function disableForm() {
        var i;

        for (i = 0; i < inputAndSelects.length; i++) {
            inputAndSelects[i].setAttribute("disabled", "disabled");
        }
    }

    //Visar ett felmeddelande för misslyckad validering av ett input-element.
    function displayFailedValidation(element) {
        var divError = document.createElement("div"),
            errorTextNode,
            errorText;

        if (element.getAttribute("class") === "text") {
            errorText = "Fältet får inte vara tomt";
        } else if (element.getAttribute("id") === "zipCode") {
            errorText = "Använd formatet XXXXX";
        } else if (element.getAttribute("id") === "email") {
            errorText = "Ange en giltig e-postadress";
        }
        errorTextNode = document.createTextNode(errorText);
        if (element.nextElementSibling.className !== "errorText") { //för att inte upprepa ett felmeddelande som redan finns.
            divError.appendChild(errorTextNode);
            divError.setAttribute("class", "errorText");
            element.parentNode.insertBefore(divError, element.nextSibling);
        }
    }

    //Korrigerar igenkännbara felaktiga inmatningar i input-elementens värden och returnerar den korrigerade textsträngen.
    //Om makeChanges är true, korrigeras värdet även direkt i input-elementets värde.
    function autoCorrectField(element, makeChanges) {
        var newElementValue = element.value;

        newElementValue = newElementValue.trim();

        if (element.getAttribute("class") === "text") {
            newElementValue = newElementValue.replace(/\s\s/g, " ");
        } else if (element.getAttribute("id") === "zipCode") {
            newElementValue = newElementValue.replace(/^(?:SE)? ?(\d{3})[\s\-]?(\d{2})$/, "$1$2");
        } else if (element.getAttribute("type") === "email") {
            newElementValue = newElementValue.replace(/(\.co)$/, "$1m");
        }

        if (makeChanges) {
            element.value = newElementValue;
        }
        return newElementValue;
    }

    //tar bort felmeddelande som hör till givet input-element
    function removeErrorMessage(inputElement) {
        if (inputElement.nextElementSibling.getAttribute("class") === "errorText") {
            inputElement.parentNode.removeChild(inputElement.nextElementSibling);
        }
    }

    //testar om givet input-elements värde kan valideras eller ej.
    //Om makeChangesToElement är true, görs ändringar direkt på elementets värde, om det är möjligt.
    function validate(inputElement, makeChangesToElement) {
        var type = inputElement.getAttribute("class"),
            text = autoCorrectField(inputElement, makeChangesToElement);

        if (validated(text, type) === true) {
            addAttributeValueIfNotExists(inputElement, "class", "validated");
            return true;
        } else {
            removeAttributeValueIfExists(inputElement, "class", "validated");
            return false;
        }
    }

    //generell funktion som lägger till ytterligare ett värde till ett attribut, om det inte redan finns (men låter redan existerande värden finnas kvar).
    function addAttributeValueIfNotExists(element, attribute, value) {
        var myRegExp = new RegExp("\\b" + value + " ?\\b");
        if (!myRegExp.test(element.getAttribute(attribute))) {
            element.setAttribute(attribute, element.getAttribute(attribute) + " " + value);
        }
    }

    //generell funktion som tar bort ett värde till ett attribut, om det finns (men låter ev. resterande värden finnas kvar)
    function removeAttributeValueIfExists(element, attribute, value) {
        var myRegExp = new RegExp("( " + value + "|" + value + " ?)");
        if (myRegExp.test(element.getAttribute(attribute))) {
            element.setAttribute(attribute, element.getAttribute(attribute).replace(myRegExp, ""));
        }
    }

    //kontrollerar om värdet kan valideras eller inte, beroende på vilken typ av validering som ska göras (text, zipCode, email).
    function validated(text, type) {
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
            //som fortsätter med 0 eller flera bokstäver och/eller siffror (samt _) och
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
            return (/^[a-z][a-z0-9_\-]*(\.[a-z0-9_\-]+)?@([a-z0-9_\-]+\.){1,2}[a-z]{2,6}$/i.test(text));
        }
    }

};