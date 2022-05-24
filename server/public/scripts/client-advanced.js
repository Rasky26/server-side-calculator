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
function onClickCalculatorButton() {

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


// Function that checks for the changes that occurred
// on the user-input string, gets the index where that
// change occurred, and then runs the `checkForCharSwap()`
function compareChangesToEntry(equationString) {

    // Clear the current answer
    $("#answer").text("")

    // Loop over the current string and get char and index
    for (let i = 0; i < equationString.length; i++) {
        const char = equationString[i];

        // Check for automatic character changes that
        // should be made
        equationString = checkForCharSwap(char, i, equationString)
    }

    // If the last symbol was an `=` sign, send the equation
    // to the server to process for results
    if (equationString[equationString.length - 1] === "=") {
        
        // Remove the trailing `=` sign before sending to the server
        equationString = equationString.substring(0, equationString.length - 1)

        sendEquationToServer(equationString)
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

                // Replace the TWO consecutive multiplicaations with
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

    // Swap to subtraction symbol
    if (char === "-") {
        stringToArray.splice(index, 1, "–")
    }

    // Return the array back to a string
    rawInputString = stringToArray.join('')
    
    return rawInputString
}


// Function that handles the sending the equation to the
// server and the response
function sendEquationToServer(equation) {

    // Send the equation string to the server to
    // be processed
    $.ajax(
        {
            url: "/advanced-calculator",
            method: "POST",
            data: {equation: equation},
        }
    )

        // Get the response information
        .then (response => {
            console.log(response, "on advanced client")

            $("#answer").text(response.answer)

        })

        // Capture the error if one occurs
        .catch((err) => {
            console.log('An error occurred!', err)
        }
    )
}