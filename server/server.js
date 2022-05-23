// --------------------------------
// Import `express`
const express = require("express");
const bodyParser = require("body-parser")


// --------------------------------
// Initialize the app funmction
const app = express();


// --------------------------------
// Restrict the folder structure to only send
// files contained in the public folder
app.use(express.static("./server/public"))
// Add bodyParser to help with requests:
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())


// Global values
const commPort = 5000
let basicCalculatorHistory = []
let advancedCalculatorHistory = []
let validMathSymbols = "^×÷+–"


// --------------------------------
// Route for posting a basic calculator request
app.post("/basic-calculator", (req, res) => {

    // Initialize the incoming object as a different variable
    let equation = req.body
    equation.valueOne = Number(equation.valueOne)
    equation.valueTwo = Number(equation.valueTwo)

    // Send the request to the operation analyzer
    let answer = basicCalculatorParseCalculation(equation)

    // Add the answer into the equation object
    equation.answer = answer

    // Push the current equation into the calculator history
    basicCalculatorHistory.push(equation)

    // Return the answer back to the client
    res.send(
        {
            answer: answer,
            history: basicCalculatorHistory,
        }
    )
})


// --------------------------------
// ********************************
//      MAIN LISTENER FUNCTION
// ********************************
// --------------------------------
// Main listener function
app.listen(commPort, () => {
    console.log("The server is live!")
})


// --------------------------------
// ********************************
//       CORE MATH FUNCTIONS
// ********************************
// --------------------------------

// Main entry point for incoming basic calculator calculations.
// Take in an object and parse through the results
function basicCalculatorParseCalculation(obj) {

    console.log(obj, "obj")
    // Initialize the result variable
    let result;

    // Identify the mathematical operation to conduct
    switch (obj.operation) {
        case 'multiplication':
            result = multiplication(obj.valueOne, obj.valueTwo)
            break;
        case 'division':
            result = division(obj.valueOne, obj.valueTwo)
            break;
        case 'addition':
            result = addition(obj.valueOne, obj.valueTwo)
            break;
        case 'subtraction':
            result = subtraction(obj.valueOne, obj.valueTwo)
            break;
        default:
            // Shouldn't get here
            console.log(obj, "CHECK THIS OBJ, SHOULD NOT HAVE HAPPENED!")
            break;
    }

    // Return the result of the operations
    return result

}


// Core mathematical functions
function multiplication(numOne, numTwo) {
    return numOne * numTwo
}

function division(numOne, numTwo) {
    return numOne / numTwo
}

function addition(numOne, numTwo) {
    return numOne + numTwo
}

function subtraction(numOne, numTwo) {
    return numOne - numTwo
}





//////////////////////////////////////////////
// ---------------------------------------- //
//                                          //
//      ADVANCED CALCULATOR FUNCTIONS       //
//                                          //
// ---------------------------------------- //
//////////////////////////////////////////////

app.post("/advanced-calculator", (req, res) => {

    console.log('on the server')
    console.log(req.body)

    answer = parseEquation(req.body.equation)

    res.send({
        answer: answer,
        history: advancedCalculatorHistory,
    })
})


// Function that takes in the raw equation and
// returns an answer to the client
function parseEquation(equation) {

    // Get rid of any spaces in the equation
    // REF: https://stackoverflow.com/a/5963256
    equation = equation.split(' ').join('')

    reduceEquation(equation)

    let answer = 0

    return answer
}


// Function that will repeatedly loop over the equation and
// reduce it each step
function reduceEquation(equation) {

    // Object that will store the two terms to calculate
    let reducedValues = resetCurrentCalculationObject()

    // Tracks the current nested parenthesis level
    let parenthesisLevel = 0

    // Set storage of variable before assigning to object.
    // Initialize the `currentNumber` as the first element
    // of the `equation` string for easier processing.
    // This will help if a number begins with a negative symbol.
    let currentNumber = equation[0]

    // Check if the starting value is a parenthesis
    if (currentNumber === '(') {
        
        // Raise the parenthesis level by one
        parenthesisLevel++

        // Reset the `currentNumber` back to blank
        currentNumber = ""
    }

    // Set boolean flag that tracks if an expression was
    // just added to the object
    let foundSymbol = false

    // Loop over the equation string, going char by char
    for (let index = 1; index < equation.length; index++) {
        const char = equation[index];

        console.log(char, "This is our current char!", reducedValues, currentNumber, "<- currentNumber", validMathSymbols.includes(char))
        
        // Tracks the parenthesis nesting
        // if (element === '(') {
        //     parenthesisLevel++
        //     maxParenthesisLevel++
        // } else if (element == ')') {
        //     parenthesisLevel--
        // }

        // Check for a parenthesis, if one is found we need
        // to clear out to object as an equation of higher
        // importance is found
        if (char === "(") {

            // Increment the parenthesis level
            parenthesisLevel++

            // Reset the object values reducedValues = {
            reducedValues = resetCurrentCalculationObject()

            // Reset the `foundSymbol` variable to `false`
            foundSymbol = false
        
            console.log("Starting parenthesis", reducedValues)
            // Skip any of analysis, so continue to next iteration
            continue
        }

        if (char === ")") {

            // De-increment the parenthesis level
            parenthesisLevel--

            // Check if the reduced values object is full of found variables
            if (reducedValues.firstValue && reducedValues.operation && reducedValues.secondValue) {

                // LATER --> DO the calculation!!
                console.log("BUILD CLOSE () FEATURE!", reducedValues)

                console.log(calculateAnswerFromObject(reducedValues), "<<<-----!!!!")

                // Skip any of further analysis, continue the loop
                continue
            }
        }

        // Check if a valid math symbols was found
        if (validMathSymbols.includes(char)) {

            console.log("FOUND SYMBOL", char, "!!!")
            // ---- IF BLOCK ----
            // First, check if `reducedValues` has an `operation`
            // value already found
            if ((char === '–') && (reducedValues.operation)) {

                // The current value is negative for the second value
                reducedValues.secondValue += char
                foundSymbol = false

                // Continue with the next step in the loop
                continue
            }

            // Check if the `currentNumber` needs to be be set to negative.
            // If nothing exists on the `currentNumber` variable, then we know
            // that this first number must be negative.
            else if ((char === '–') && (!currentNumber)) {

                // `currentNumber` should be negative
                currentNumber += char
                foundSymbol = false

                // Continue with the next step in the loop
                continue
            }
            // ---- END IF BLOCK ----

            // ---- IF BLOCK ----
            // Because negative symbols have been accounted for, this should
            // allow us to select the current mathematical operation symbol
            //
            // First, check if a valid mathematical symbol already exists
            // on our `reducedValues` object. If one does, we need to then
            // check the order of operations.
            if (reducedValues.operation) {

                console.log("   WHOA,", char, ":", validMathSymbols.indexOf(char), validMathSymbols.indexOf(reducedValues.operation))

                // Check if the current symbol is of higher importance than
                // the current operation. Because `validMathSymbols` is set
                // based on order-of-operation, we can just compare the index
                // location to see which is more important.
                if (validMathSymbols.indexOf(char) < validMathSymbols.indexOf(reducedValues.operation)) {

                    // Therefore, move the the `reducedValues.secondValue` into
                    // the `firstValue` position, set the operation to the new
                    // symbol, and clear the `secondValue`
                    reducedValues.firstValue = reducedValues.secondValue
                    reducedValues.operation = char
                    reducedValues.secondValue = ""

                    // A symbol was found, so flag this variable as `true`
                    foundSymbol = true
                
                    // Continue with the next step in the loop
                    continue
                }
            }

            // Otherwise, we need to move values into our `reducedValues` array
            else {

                // Otherwise, move the `currentNumber` value into the object and
                // and mathematical function as well
                reducedValues.firstValue = currentNumber
                reducedValues.operation = char

                // Clear the `currentNumber` value
                currentNumber = ""

                console.log("Moved values to obj", reducedValues, currentNumber)

                // Continue with the next step in the loop
                continue
            }
            // ---- END IF BLOCK ----
        }
    



        // If the current value is a valid number char or symbol
        // then store it temporarily in the `currentNumber`
        // variable
        if (isValidNumberCharacter(char)) {
            
            // Check if a value exists on the `reducedValues.firstValue`,
            // which means we can append this current `char` to 
            // `secondValue`
            if (reducedValues.firstValue) {

                // Append on the current item to the `secondValue`
                reducedValues.secondValue += char
            }

            else {

                // Add the string into the current variable
                currentNumber += char
            }

            console.log(currentNumber, char, "FIOUND number")
        }


    }

    console.log(currentNumber, "cnumber")

    // Catch-all for the last number coming into the object
    // reducedValues.secondValue = currentNumber

    console.log("--> FINAL::::", reducedValues)

}


// Function the initializes the direct variables for
// our calculation. Put it in a function so if edits are
// made that I can only change it here.
function resetCurrentCalculationObject() {

    return {
        startIndex: '',
        firstValue: '',
        operation: '',
        secondValue: '',
        endIndex: '',
        directlyContainedInParenthesis: false,
    }
}


// Function that tests if a character is found in a
// valid number
function isValidNumberCharacter(char) {

    // Build in the `e` term later...

    // Check if it is a number
    if (!isNaN(char)) {
        return true
    }

    // Check for decimal points
    if (char === ".") {
        return true
    }

    // Check for negative sign
    if (char === "–") {
        return true
    }

    return false
}


// Function that calculates the current object to an answer
function calculateAnswerFromObject(values) {

    // Convert the strings to numbers
    const numOne = Number(values.firstValue)
    const numTwo = Number(values.secondValue)

    // Choose which type of operation to do
    switch (values.operation) {

        case "^":
            return Math.pow(numOne, numTwo)
            break;

        case "×":
            return numOne * numTwo
            break

        case "÷":
            return numOne / numTwo
            break

        case "+":
            console.log("here?", numOne + numTwo)
            return numOne + numTwo
            break

        case "–":
            return numOne - numTwo
            break

        default:
            console.log("WHOA WHOA, this wasn't supposed to get here!!!!")
            break;
    }
}