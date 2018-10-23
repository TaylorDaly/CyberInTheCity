// Dependencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

const port = 3000;

app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// We are telling express server angular-src folder is the place to look for the static files
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', function (req, res) {

    res.status(404).send("404: Page Does not exist.");
});

//Listen to port 3000
app.listen(port, function () {
    console.log(`Starting the server at port ${port}`);
});