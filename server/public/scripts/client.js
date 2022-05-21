// Initialize the document
$(main)



// Set the main container function
function main() {

    // Set the current inventory list on load
    console.log('Initiated')

    // --------------------------------
    // Basic Calculator - listener functions

    // Within the basic calculator, properly sets and flags the selected
    // mathematical operation
    $(".basic-operation").click(setBasicCalculatorOperationActive)

    $("#basic-equals").click(handleBasicCalculation)
}


// Function that creates an empty object
// that stores the inputs from the basic
// calculator inputs
function emptyBasicCalculatorObject() {

    // Set an empty object
    let basicCalculatorInputs = {
        inputOne: '',
        inputTwo: '',
        operationType: '',
    }
    
    return basicCalculatorInputs
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


// Function that handles clicking the `=` button. Ensures values
// were provided to both buttons, gathers the information, and
// returns the results to the DOM.
function handleBasicCalculation(e) {

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

    e.preventDefault()
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





// For the advanced one: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key