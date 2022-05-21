// --------------------------------
// Import `express`
const express = require('express');
const bodyParser = require('body-parser')


// --------------------------------
// Initialize the app funmction
const app = express();


// --------------------------------
// Restrict the folder structure to only send
// files contained in the public folder
app.use(express.static('./server/public'))
// Add bodyParser to help with requests:
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())


// Global values
const commPort = 5000


// Main listener function
app.listen(commPort, () => {
    console.log('The server is live!')
})