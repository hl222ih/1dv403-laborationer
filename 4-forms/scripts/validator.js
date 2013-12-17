"use strict";

window.onload = function () {
    var form = document.getElementById("payForm"),
        inputs = form.getElementsByTagName("input"),
        labels = form.getElementsByTagName("label"),
        inputAndSelects = form.querySelectorAll("input, select"),
        i;

    for (i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('keyup', function (e) { validate(e.target, false); }, false);
        inputs[i].addEventListener('blur', function (e) {
            if (!validate(e.target, true)) {
                displayFailedValidation(e.target);
            }
        }, false);
        inputs[i].addEventListener('focus', function (e) { removeErrorMessage(e.target); }, false);
    }

    document.getElementById("submit").addEventListener("click", function (e) {
        var allValidated = true;

        for (i = 0; i < inputs.length; i++) {
            if (!validate(inputs[i], true)) {
                allValidated = false;
            }
        }

        if (allValidated) {
            createModalPopup();
        }
    }, false);


    function createModalPopup() {
        var header = document.createElement("h2"),
            i,
            div,
            popup = document.getElementById("popup"),
            id,
            value,
            fullDim = document.getElementById("fullDim"),
            labels = form.getElementsByTagName("label"),
            submitButton,
            cancelButton,
            priceModel = document.getElementById("priceModel"),
            headerText = document.createTextNode("Bekräfta uppgifter");

        addAttributeValueIfNotExists(fullDim, "style", "display");
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
            var hello = form.submit();
            removeModalPopup(fullDim, popup);
            e.preventDefault();
        }, false);
        cancelButton.addEventListener("click", function (e) {
            removeModalPopup(fullDim, popup);
        }, false);
        disableForm();
    }

    function removeModalPopup(fullDim, popup) {
        while (popup.firstChild !== null) {
            popup.removeChild(popup.firstChild);
        }
        removeAttributeValueIfExists(fullDim, "style", "display");
        enableForm();
    }

    function enableForm() {
        var i;

        for (i = 0; i < inputAndSelects.length; i++) {
            inputAndSelects[i].removeAttribute("disabled");
        }
    }

    function disableForm() {
        var i;

        for (i = 0; i < inputAndSelects.length; i++) {
            inputAndSelects[i].setAttribute("disabled", "disabled");
        }
    }

    function displayFailedValidation(element) {
        var divError = document.createElement("div"),
            errorNode,
            errorText;

        if (element.getAttribute("class") === "text") {
            errorText = "Fältet får inte vara tomt";
        } else if (element.getAttribute("id") === "zipCode") {
            errorText = "Använd formatet XXXXX";
        } else if (element.getAttribute("id") === "email") {
            errorText = "Ange en giltig e-postadress";
        }
        errorNode = document.createTextNode(errorText);
        divError.appendChild(errorNode);
        divError.setAttribute("class", "errorText");
        element.parentNode.insertBefore(divError, element.nextSibling);

    }

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

    function removeErrorMessage(element) {
        if (element.nextElementSibling.getAttribute("class") === "errorText") {
            element.parentNode.removeChild(element.nextElementSibling);
        }
    }
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

    function addAttributeValueIfNotExists(element, attribute, value) {
        var myRegExp = new RegExp("\\b" + value + " ?\\b");
        if (!myRegExp.test(element.getAttribute("class"))) {
            element.setAttribute("class", element.getAttribute("class") + " " + value);
        }
    }

    function removeAttributeValueIfExists(element, attribute, value) {
        var myRegExp = new RegExp("( " + value + "|" + value + " ?)");
        if (myRegExp.test(element.getAttribute("class"))) {
            element.setAttribute("class", element.getAttribute("class").replace(myRegExp, ""));
        }
    }

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
            return (/^[a-z][a-z0-9_\-]*(\.[a-z0-9_\-]+)?@([a-z0-9_\-]+\.){1,2}[a-z]{2,6}$/i.test(text));
        }
    }

};