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
const commPort = process.env.PORT || 5000
let basicCalculatorHistory = []
let advancedCalculatorHistory = []
// let validMathSymbols = "^×÷+–-"
let validMathSymbols = ["^", "×÷", "+–-"]


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

    // Rename the `req.body` to `equation`
    let equationObject = req.body

    // Get rid of any spaces in the equation
    // REF: https://stackoverflow.com/a/5963256
    equation = equationObject.equation.split(' ').join('')
    equationObject.equation = equation

    // Run the functions to get an answer
    answer = parseEquation(equation)

    // Add the answer to the equation object
    equationObject.answer = answer

    // Update the history
    advancedCalculatorHistory.push(equationObject)

    // Return the results to the user
    res.send({
        answer: answer,
        history: advancedCalculatorHistory,
    })
})


// Function that takes in the raw equation and
// repeatedly reduces it until an answer is found. Then it 
// returns an answer to the client
function parseEquation(equation) {

    // Set a variable to store the initial equation BEFORE processing
    let initialEquation = equation
    
    // Set a variable to store the reduced equation AFTER processing
    let reducedEquation = reduceEquation(equation)

    console.log("Initial:", initialEquation, "After:", reducedEquation)

    // Loop the reduction function repeatedly until a match between
    // `reducedEquation` and `initialEquation` --> meaning the equation
    // has been fully reduced
    while (reducedEquation !== initialEquation) {

        console.log(`
        ============================`)
        console.log("INIT:", initialEquation)
        console.log("REDU:", reducedEquation)
        console.log(`
        ============================`)

        initialEquation = reducedEquation
        reducedEquation = reduceEquation(reducedEquation)

    }

    // Once the equation can no longer be reduced, return
    // the result, which will be the answer!
    return reducedEquation
}


// Function that will repeatedly loop over the equation and
// reduce it each step
function reduceEquation(equation) {

    // Object that will store the two terms to calculate
    let reducedValues = resetCurrentCalculationObject()

    // Tracks the current nested parenthesis level
    // let parenthesisLevel = 0

    // Set storage of variable before assigning to object.
    // Initialize the `currentNumber` as the first element
    // of the `equation` string for easier processing.
    // This will help if a number begins with a negative symbol.
    let currentNumber = equation[0]

    // Set the `startIndex` to zero
    reducedValues.startIndex = 0

    // Check if the starting value is a parenthesis
    if (currentNumber === "(") {
        
        // Raise the parenthesis level by one
        parenthesisLevel++

        // Reset the `currentNumber` and `startIndex` back to blank
        currentNumber = ""
        reducedValues.startIndex = ''
    }

    // Loop over the equation string, going char by char
    for (let index = 1; index < equation.length; index++) {
        const char = equation[index];

        console.log(char, "This is our current char!", reducedValues, currentNumber, "<- currentNumber")

        // Check for a parenthesis, if one is found we need
        // to clear out to object as an equation of higher
        // importance is found
        if (char === "(") {

            // Reset the object values reducedValues = {
            reducedValues = resetCurrentCalculationObject()

            // Skip any of analysis, so continue to next iteration
            continue
        }

        // Check for a closing parenthesis, meaning some equation should be run
        if (char === ")") {

            // Update the `endIndex` value to the previous index
            reducedValues.endIndex = index - 1

            // Check if the reduced values object is full of found variables
            if (reducedValues.firstValue && reducedValues.operation && reducedValues.secondValue) {

                // Get the updated equation, now reduced
                equation = calculateAnswerFromObject(reducedValues, equation)

                // Skip any of further analysis, continue the loop
                return equation
            }
        }

        // Check if a valid math symbols was found
        if (validMathSymbols.join("").includes(char)) {

            console.log(((char === "–") || (char === "-")), // Check if negative sign
            (reducedValues.operation),         // Ensure an operation is already set
            (reducedValues.secondValue === ""),
            "!@#*(^!#%&!$!@*&!@#&^", ((char === "–") || (char === "-")) && // Check if negative sign
            (reducedValues.operation) &&          // Ensure an operation is already set
            (reducedValues.secondValue === "") )

            // ---- IF BLOCK ----
            // First, check if `reducedValues` has an `operation`
            // value already found
            if (
                
                ((char === "–") || (char === "-")) && // Check if negative sign
                (reducedValues.operation) &&          // Ensure an operation is already set
                (reducedValues.secondValue === "")    // Make sure `secondValue` is blank
            ) {
                console.log(`
                in 1
                `)
                // The current value is negative for the second value
                reducedValues.secondValue += "-"
                reducedValues.secondValueStartIndex = index

                // Continue with the next step in the loop
                continue
            }

            // Check if the `currentNumber` needs to be be set to negative.
            // If nothing exists on the `currentNumber` variable, then we know
            // that this first number must be negative.
            else if (
                ((char === "–") || (char === "-")) &&    // Current character is minus
                (!currentNumber) &&                      // `currentNumber` is not set
                (!(                                      // Set a NOT operand
                    (reducedValues.operation !== "–") || // Existing operation not minus
                    (reducedValues.operation !== "-")
                ))
            ) {
                console.log(`
                in 2 && ${(reducedValues.operation !== "–")}, ${(reducedValues.operation !== "-")} && ${char} === ${(char === "–")} && ${(!currentNumber)}
                `)
                // `currentNumber` should be negative
                currentNumber += "-"
                reducedValues.startIndex = index

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

                // Need to set the order of operation
                //
                // Initialize variables to hold the found indexes
                let indexOfCurrentOperation;  // Current character in loop
                let indexOfExistingOperation; // Existing operation in object
                // Loop through `validMathSymbols` to get the current index
                for (let index = 0; index < validMathSymbols.length; index++) {
                    const operations = validMathSymbols[index];

                    console.log("LOOOOK!!!", operations, operations.indexOf(char), operations.indexOf(reducedValues.operation))

                    // Set the index of the current character in the loop
                    if (operations.indexOf(char) > -1) {
                        indexOfCurrentOperation = index
                    }

                    // Set the index of the existing operation in the object
                    if (operations.indexOf(reducedValues.operation) > -1) {
                        indexOfExistingOperation = index
                    }
                }

                console.log("RESULTSL:", indexOfCurrentOperation, indexOfExistingOperation)

                // Check if the current symbol is of higher importance than
                // the current operation. Because `validMathSymbols` is set
                // based on order-of-operation, we can just compare the index
                // location to see which is more important.
                if (indexOfCurrentOperation < indexOfExistingOperation) {

                    // Therefore, move the the `reducedValues.secondValue` into
                    // the `firstValue` position, set the operation to the new
                    // symbol, and clear the `secondValue`
                    reducedValues.startIndex = reducedValues.secondValueStartIndex
                    reducedValues.firstValue = reducedValues.secondValue
                    reducedValues.operation = char
                    reducedValues.secondValue = ""
                    reducedValues.secondValueStartIndex = ""
                
                    // Continue with the next step in the loop
                    continue
                }

                // If this operation is lesser important, then the currently stored
                // object is set for processing, so send the `reducedValues` obj
                // to be calculated
                else {

                    // Get the updated equation, with a calculation completed
                    equation = calculateAnswerFromObject(reducedValues, equation)

                    return equation
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

                // Check if the second value start value has been set
                if (reducedValues.secondValueStartIndex === "") {

                    // If not, set it to the current index
                    reducedValues.secondValueStartIndex = index

                }

                // Update the ending index value
                reducedValues.endIndex = index
            }

            // Otherwise, store the `char` on the `currentNumber` variable
            else {

                // Add the string into the current variable
                currentNumber += char

                // Set the starting index if not already set
                if (reducedValues.startIndex === "") {

                    // Set the starting index value
                    reducedValues.startIndex = index
                }
            }
        }
    }

    // If the end of the equation is reached, check if further processing is needed
    // by checking if the `firstValue` and `secondValue` are not blank
    if (reducedValues.firstValue && reducedValues.secondValue) {

        // Send the current object to be reduced
        equation = calculateAnswerFromObject(reducedValues, equation)
    }

    console.log(`
    
    !!!!!!!!!!!!!!!!!!!!
    SHOULD BE THE ANSWER

    EQUATION: ${equation}
    `)

    console.log(" Send back equation")
    return equation

}


// Function the initializes the direct variables for
// our calculation. Put it in a function so if edits are
// made that I can only change it here.
function resetCurrentCalculationObject() {

    return {
        startIndex: '',
        firstValue: '',
        operation: '',
        secondValueStartIndex: '',
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
    if (char === "–" || char === "-") {
        return true
    }

    return false
}


// Function that calculates the current object to an answer
// and reduces the equation. Once reduced, re-call the `reduceEquation()`
// function to further simplify the equation
function calculateAnswerFromObject(values, equation) {

    // Using the object that holds our current values, do math
    // to see what that should be reduced to, called `answer`
    const answer = calculateAnswer(values)

    console.log("ANSWER!! line 462", answer)

    // Check for parenthesis IMMEDIATELY surrounding the current
    // equation
    if (
        // Check BEFORE the `startIndex` for a "(" symbol
        (
            // Validate that SOMETHING exists at the `startIndex`
            (equation[values.startIndex - 1] !== undefined) &&
            // And check if the symbol matches the "(" symbol
            (equation[values.startIndex - 1] === "(")
        ) && 
        (
            // Validate that SOMETHING exists after the `endIndex`
            (equation[values.endIndex + 1] !== undefined) &&
            // And check if that symbol matches the ")" symbol
            (equation[values.endIndex + 1] === ")")
        )
    ) {

        // Split the equation into an array so we can use the `splice()` function
        let equationArray = equation.split("")

        // Splice the `answer` into the `equation` in place of the
        // existing values
        equationArray.splice(
            // Set the starting value
            values.startIndex - 1,
            // Needs to be +2 to get the closing ")" string
            (values.endIndex + 2) - (values.startIndex - 1),
            // Splice in the calculated `answer`
            answer
        )

        equation = equationArray.join("")
    }

    // Otherwise there was no parenthesis, so just reduce the equation
    else {

        // Split the equation into an array so we can use the `splice()` function
        let equationArray = equation.split("")

        // Splice the `answer` into the `equation` in place of the
        // existing values
        equationArray.splice(
            // Set the starting value
            values.startIndex,
            // Needs to be +2 to get the closing ")" string
            (values.endIndex + 1) - (values.startIndex),
            // Splice in the calculated `answer`
            answer
        )

        equation = equationArray.join("")
    }

    // With the newly reduced equation, now re-call the `reduceEquation()`
    // function to further reduce the equation.
    // Repeat this over and over until it can no longer be reduced!
    console.log(`

    -----------------------------
        RETURN WITH ${equation}
    -----------------------------
    
    `)

    return equation
}


// Function that handles the specific mathemathical operation
function calculateAnswer(values) {

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
            return numOne + numTwo
            break

        case "–":
            console.log(numOne, typeof(numOne), numTwo, typeof(numTwo))
            return numOne - numTwo
            break

        default:
            console.log("WHOA WHOA, this wasn't supposed to get here!!!!")
            break;
    }
}