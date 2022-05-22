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
    res.sendStatus(201)
})