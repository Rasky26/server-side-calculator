// Initialize the document
$(advancedMain)


// Set global variables
let currentEquation = [];
let rawInputString = '';
let comparitorRawInputString = '';
let indexOfLastChange = 0;
const validFields = "0123456789.()×÷+–*";


// >> MAIN ENTRY POINT <<
function advancedMain() {

    // Two entry-points for input on screen:
    //
    // 1.) Click a button on the screen
    $(".advanced-calculator-button").click(onClickCalculatorButton)

    // 2.) Use this listener that handles the equation input
    // for each character entered
    // REF: https://stackoverflow.com/a/19405157
    $("#equation-entry").on("input", formatEquationEntry)
}


// Function that handles clicking the input buttons directly.
function onClickCalculatorButton(event) {

    event.preventDefault()

    // Get the `data` value from that specific button
    let inputChar = String($(this).data('value'))
    // Get the current input text
    let equationString = $("#equation-entry").val()

    // Add the button clicked to the `equationString`
    equationString += inputChar

    // Get the editted format of the equation
    compareChangesToEntry(equationString)
}


// Function that handles the formatting of the input
// field equation's characters
function formatEquationEntry() {

    // Get the value from the `input` value
    let equationString = this.value

    // Get the editted format of the equation
    compareChangesToEntry(equationString)
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
function compareChangesToEntry(equationString) {
    
    // Loop over the current string and get char and index
    for (let i = 0; i < equationString.length; i++) {
        const char = equationString[i];

        // Check for automatic character changes that
        // should be made
        equationString = checkForCharSwap(char, i, equationString)
    }

    // Places the cursor at the end of the input
    // after each entry
    // REF: https://stackoverflow.com/a/39468577
    $("#equation-entry").focus().val("").val(equationString)
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
    if ((char === "*") || (char === "×")) {

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