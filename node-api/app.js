// Dependencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
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

// TODO: add TLS for security
// app setup
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '../angular-src/dist')));

// TODO: Fix mongoose deprecation warning as soon as mongoose updates.
// TODO: JWT authentication
// Routes
app.use('/api/Person', peopleController);
app.use('/api/Publication', publicationController);
app.use('/api/Research', researchController);
app.use('/api/Image', imageController);
app.use('/api/ResearchLab', researchLabController);
app.use('/api/Education', educationController);
app.use('/api/Program', programController);

// re-route bad requests back to home page.
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '../angular-src/dist/index.html'));
});

app.listen(port, function () {
    console.log(`Starting the server at port ${port}`);
});