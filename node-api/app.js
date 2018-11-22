// Dependencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Imports
const dbConfig = require('./config/database');
const peopleController = require('./Controllers/PersonController');
const publicationController = require('./Controllers/PublicationController');
const researchController = require('./Controllers/ResearchController');
const imageController = require('./Controllers/ImageController');
const researchLabController = require('./Controllers/ResearchLabController');
const educationController = require('./Controllers/EducationController');
const programController = require('./Controllers/ProgramController');

// Constants
const app = express();
const port = dbConfig.nodePort || 3000;

// Database Connection
mongoose.connect(dbConfig.uri, {useNewUrlParser: true})
    .then(res => console.log(`_readyState: ${res.connections[0]._readyState}`));

// app setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '../angular-src/dist')));

// TODO: JWT authentication
// Routes
app.use('/Person', peopleController);
app.use('/Publication', publicationController);
app.use('/Research', researchController);
app.use('/Image', imageController);
app.use('/ResearchLab', researchLabController);
app.use('/Education', educationController);
app.use('/Program', programController);

// Non-existent API route error
app.use('/*', function (req, res) {
    res.status(404).send({success: false, message: "404: Page Does not exist."});
});

// Listen to port 3000
app.listen(port, function () {
    console.log(`Starting the server at port ${port}`);
});