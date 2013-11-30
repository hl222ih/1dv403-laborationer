/*global Message*/

/**
 *
 * @constructor En meddelandehanterare.
 */
function MessageBoard() {
    "use strict";
    var sendButton = document.getElementsByClassName("send")[0],
        inputArea = document.getElementsByClassName("input")[0],
        textArea = inputArea.getElementsByTagName("textarea")[0],
        that = this,
        messages = [];

    sendButton.addEventListener('click', function (e) {
        var removeButton,
            message = new Message(textArea.value, new Date());

        messages.push(message);
        removeButton = message.render(e);
        textArea.value = "";
        textArea.focus();

        removeButton.addEventListener('click', function (e) {
            //kontrollera först att användaren verkligen vill ta bort.
            var nodeToRemove = e.target.parentNode.parentNode,
                parentNodeToRemoveFrom = nodeToRemove.parentNode,
                index = 0,  //för att räkna ut meddelandets position
                node = nodeToRemove;  //för att räkna ut meddelandets position

            //Alternativ 1
            while (node.previousElementSibling !== null) {
                node = node.previousElementSibling;
                index++;
            }
            parentNodeToRemoveFrom.removeChild(nodeToRemove);
            messages.splice(index, 1);

            //Alternativ 2
            //
            //

            //ta reda på vilken nod i listan den kommer ifrån
            //ta bort detta nummer från arrayen
            //ta bort denna nod i listan.
        }, false);
    }, false);
}