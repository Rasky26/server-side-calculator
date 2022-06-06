// Initialize the document
$(main)


// Set global variables
const mathNameSymbolLookUp = {
    // Name to symbols
    "addition": "+",
    "subtraction": "–",
    "multiplication": "×",
    "division": "÷",

    // Symbols to name
    "+": "addition",
    "–": "subtraction",
    "×": "multiplication",
    "÷": "division",
}


// Set the main container function
function main() {

    // --------------------------------
    // Basic Calculator - listener functions

    // Within the basic calculator, properly sets and flags the selected
    // mathematical operation
    $(".basic-operation").click(setBasicCalculatorOperationActive)

    $("#basic-equals").click(handleBasicCalculation)
}


// Function that correctly flags the selected button within the
// basic calculator form
function setBasicCalculatorOperationActive() {

    // Return all `data-selected` flags back to `false` and
    // remove the CSS class that turns the selected button
    // an obvious color.
    for (let item of $(".basic-operation")) {

        // With jQuery, use the unique `id` name found in
        // `item.id` to look up and set the data-* field to
        // `false` and remove any CSS styling.
        // This will reset all the operation buttons
        $(`#${item.id}`).data("selected", "false")
        $(`#${item.id}`).removeClass("selectedButton")
    }

    // Set the selected button `data-selected` value to "true"
    $(this).data("selected", "true")
    // Add a CSS class to color the selected button
    $(this).addClass("selectedButton")
}


// Function that handles the GET method of past equations
function getPastEquations() {
    $.ajax(
        {
            url: "/basic-calculator",
            method: "GET"
        }
    )
    // Get the resposne information
    .then(response => {

        updateSimpleCalculatorHistoryOnDom(response.history)
    })
    // Capture the error if one occurs
    .catch((err) => {
        console.log('An error occurred!', err)
    })
}


// Function that handles clicking the `=` button. Ensures values
// were provided to both buttons, gathers the information, and
// returns the results to the DOM.
function handleBasicCalculation(e) {
    e.preventDefault()

    // Clean up any existing error messages that may remain on the page:
    $("#basic-calculator-missing-field").remove()

    // Gather the two input values. Use jQuery to target their
    // `id` values
    const valueOne = $('#basic-calculator-value-one').val()
    const valueTwo = $("#basic-calculator-value-two").val()
    let operationSelection;

    // Loop over the mathematical operation buttons and find
    // the selected button.
    for (let item of $(".basic-operation")) {

        // Find the button with the `data-selected` value set to `true`
        if ($(`#${item.id}`).data("selected") === "true") {

            // Store the value on the `data-operator` field.
            operationSelection = $(`#${item.id}`).data("operator")

            // Break out of the loop, no reason to keep iterating.
            break
        }
    }

    // Contain these fields into an object
    const inputFields = {
        valueOne: valueOne,
        valueTwo: valueTwo,
        operation: operationSelection,
    }

    // Do a simple validation to make sure all fields in the
    // object exist (no blanks or undefined values)
    if (!validateAllFieldsExist(inputFields)) {

        // If a field was missing, add a message to the DOM
        // that all fields MUST be selected.
        $("#basic-calculator-container").append(`
            <p id="basic-calculator-missing-field" class="error-message">
                All fields MUST be filled / selected! Try again...
            </p>
        `)

        // Stop the function from continuing
        return
    }

    // If valid information exists within the object, send the information
    // to the server.js as a POST request
    $.ajax(
        {
            url: "/basic-calculator",
            method: "POST",
            data: inputFields
        }
    )
    // Get the resposne information
    .then((response) => {
        getPastEquations()
    })
    // Capture the error if one occurs
    .catch((err) => {
        console.log(`${err}`)
        console.log('An error occurred!', err)
    })
}


// Function to make sure all the values are present in the object.
// Keeping this validation very simple...
function validateAllFieldsExist(obj) {

    // Use a `for in` loop to check all object values
    for (const index in obj) {

        // Check if the value is `undefined` or blank
        if ((obj[index] === undefined) || (!obj[index])) {

            // Return `false`
            return false
        }
    }

    // All values are present, return `true`
    return true
}


// Function that updates the equation history on the DOM
function updateSimpleCalculatorHistoryOnDom(historyArray) {

    // Clear the current history values to the DOM
    $("#basic-calculator-history-log").empty()

    console.log(historyArray, 'historyArray')

    // Loop through the history array in reverse order
    for (i=historyArray.length-1; i>-1; i--) {

        // Add the historical values back to the DOM
        $("#basic-calculator-history-log").append(`
            <li class="history" data-history-number="${i}">
                <span class="history-value">${historyArray[i].valueOne}</span>
                <span class="history-symbol">${mathNameSymbolLookUp[historyArray[i].operation]}</span>
                <span class="history-value">${historyArray[i].valueTwo}</span>
                <span class="history-symbol">=</span>
                <span class="history-value history-value-answer">${historyArray[i].answer}</span>
            </li>
        `)
    }
}


// For the advanced one: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key