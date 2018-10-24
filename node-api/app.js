// Dependencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Constants
const app = express();
const port = 3000;
const uri = require('./config/database').database;

mongoose.connect(uri, {useNewUrlParser: true})
    .then(res => console.log(`_readyState: ${res.connections[0]._readyState}`));

app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', function (req, res) {
    res.status(404).send("404: Page Does not exist.");
});

//Listen to port 3000
app.listen(port, function () {
    console.log(`Starting the server at port ${port}`);
});