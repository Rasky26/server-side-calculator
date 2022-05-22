// Initialize the document
$(advancedMain)


// Set global variables
let currentEquation = [];
let rawInputString = '';
let comparitorRawInputString = '';
let indexOfLastChange = 0;
const validFields = "0123456789.()×÷+–*";

function advancedMain() {

    console.log("In the advanced")

    $(".advanced-calculator-button").click(onClickCalculatorButton)

    // Main listener that handles the equation input
    // for each character entered
    // REF: https://stackoverflow.com/a/19405157
    $('#equation-input-container').on("input", "#equation-entry", formatEquationEntry)

    $("#advanced-calculator-raw-input").keypress(getManuallyAddedField)

    // REF: https://stackoverflow.com/a/1116253
    $("#advanced-calculator-raw-input").keydown(getDeleteButtonPress)
}


// Function that handles the formatting of the input
// field equation's characters
function formatEquationEntry() {

    // Get the value from the `input` value
    let inputChar = this.value

    console.log(inputChar)

    inputChar = compareChangesToEntry(inputChar)

    // Remove the current `input` field
    $("#equation-entry").remove()

    // Add in a new input field
    $("#equation-input-container").append(`
        <input type="text" name="equation-entry" id="equation-entry" />
    `)

    // Places the cursor at the end of the input
    // after each entry
    // REF: https://stackoverflow.com/a/39468577
    $("#equation-entry").focus().val("").val(inputChar)

    // $("#equation-entry")
}


// Function that handles clicking the input buttons directly.
function onClickCalculatorButton(event) {

    event.preventDefault()

    // Get the `data` value from that specific button
    let inputValue = $(this).data('value')

    // Ensure some strange input does not get passed,
    // use the approved list of characters above
    if (validFields.includes(inputValue)) {
        currentEquation.push(String(inputValue))
    }

    // Update the `<textarea>` with the new information
    $("#advanced-calculator-raw-input")
        .val('')                       // clear it
        .val(currentEquation.join("")) // place it in, joined together
}


// Function that handles typing directly into the calculator
// window
function getManuallyAddedField(event) {

    // Let the `getEnterButtonPress()` handle pressing
    // the `=` sign
    if (event.which === 61) {
        getEnterButtonPress(event)
    }

    // Get the current string input
    rawInputString = $("#advanced-calculator-raw-input").val()

    // Send the string off for comparison
    rawInputString = compareChangesToEntry(rawInputString)

    // Should update the DOM, but appears to lag behind one step
    $("#advanced-calculator-raw-input").val('')
    $("#advanced-calculator-raw-input").val(rawInputString)

    // REF: https://stackoverflow.com/a/874173
    // const keyStroke = String.fromCharCode(event.which)
}


// Function to capture if the `delete` button the the
// keyboard was pressed
function getDeleteButtonPress(event) {

    // The `event.which` corresponded with "8",
    // so purely check for that event
    if (event.which === 8) {
        console.log("Delete key pressed! Update string")
    
        // Remove the last element from the equation
        rawInputString = $("#advanced-calculator-raw-input").val()
    }
}


// If the user is in the `textarea` and hits the "Enter"
// key, treat that as hitting the "Submit" button
function getEnterButtonPress(event) {

    event.preventDefault()

    // The 'event.which` corresponded with "13"
    if ((event.which === 13) || (event.which === 61)) {
        console.log("Enter key pressed! Add functionality")
        console.log(`
        ${rawInputString}
        `)
    }

    // Send the equation string to the server to
    // be processed
    $.ajax(
        {
            url: "/advanced-calculator",
            method: "POST",
            data: {input: rawInputString},
        }
    )

        // Get the response information
        .then (response => {
            console.log(response, "on advanced client")
        })

        // Capture the error if one occurs
        .catch((err) => {
            console.log('An error occurred!', err)
        })
}


// Function that checks for the changes that occurred
// on the user-input string, gets the index where that
// change occurred, and then runs the `checkForCharSwap()`
function compareChangesToEntry(rawInputString) {
    
    // Loop over the current string and get char and index
    for (let i = 0; i < rawInputString.length; i++) {
        const char = rawInputString[i];

        // Check for automatic character changes that
        // should be made
        rawInputString = checkForCharSwap(char, i, rawInputString)
    }

    return rawInputString
}


// Function that evaluates the latest inputs and automatically
// converts to valid characters the server can use.
// This will be very basic, but this will be the core
// translation function should additional mathematical
// operations be incorporated.
function checkForCharSwap(char, index, rawInputString) {

    // Turn the current equation string to an array where
    // each character is an individual element.
    let stringToArray = rawInputString.split('')

    // Test for multiplication symbol
    if (char === "*") {

        console.log("in main checker")
        // Check if a `×` symbol exists at the prior
        // index, indicating this should be an exponential
        // function instead
        // REF: https://stackoverflow.com/a/13107879
        if (typeof(stringToArray[index - 1]) !== undefined) {

            if (stringToArray[index - 1] === "×") {

                // Replace the two multiplicaations with
                // an exponential symbol
                stringToArray.splice(index - 1, 2, "^")
            } else {

                // Otherwise, swap the current index with the
                // `×` symbol
                stringToArray.splice(index, 1, "×")
            }
        }
    }

    // Swap to division symbol
    if (char === "/") {
        stringToArray.splice(index, 1, "÷")
    }

    // Swap to math symbol
    if (char === "-") {
        stringToArray.splice(index, 1, "–")
    }

    // Return the array back to a string
    rawInputString = stringToArray.join('')
    
    return rawInputString
}