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


// --------------------------------
// Route for posting a basic calculator request
app.post("/basic-calculator", (req, res) => {

    // Send the request to the operation analyzer
    let result = basicCalculatorParseCalculation(req.body)

    res.send(
        { answer: result }
    )
})


// --------------------------------
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

    // Initialize the result variable
    let result;
    const numOne = Number(obj.valueOne)
    const numTwo = Number(obj.valueTwo)

    switch (obj.operation) {
        case 'multiplcation':
            result = multiplcation(numOne, numTwo)
            break;
        case 'division':
            result = division(numOne, numTwo)
            break;
        case 'addition':
            result = addition(numOne, numTwo)
            break;
        case 'subtraction':
            result = subtraction(numOne, numTwo)
            break;
        default:
            // Shouldn't get here
            console.log(obj, "CHECK THIS OBJ, SHOULD NOT HAVE HAPPENED!")
            break;
    }

    console.log(result)

    return result

}


// Core mathematical functions
function multiplcation(numOne, numTwo) {
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