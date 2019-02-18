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

// Constants
const app = express();
const port = dbConfig.nodePort || 3000;

// Database Connection
mongoose.connect(dbConfig.uri, require('./Config/MongooseConnectOptions'))
    .then(res => console.log(`MongoDB connection: ${res.connections[0]._readyState === 1 ? 'Success' : `Failure. Response: ${res}`}.`))
    .catch(err => console.log(err));

// TODO: add TLS for security
// app setup
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '../angular-src/dist')));

// TODO: JWT authentication on all routes
// Routes
app.use('/api/Person', require('./Controllers/PersonController'));
app.use('/api/Publication', require('./Controllers/PublicationController'));
app.use('/api/Research', require('./Controllers/ResearchController'));
app.use('/api/Image', require('./Controllers/ImageController'));
app.use('/api/ResearchLab', require('./Controllers/ResearchLabController'));
app.use('/api/Education', require('./Controllers/EducationController'));
app.use('/api/Program', require('./Controllers/ProgramController'));
app.use('/api/User', require('./Controllers/UserController'));
app.use('/api/Page', require('./Controllers/PageController'));
app.use('/api/News', require('./Controllers/NewsController'));
app.use('/api/Careers', require('./Controllers/CareersController'));

// re-route bad requests back to home page.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../angular-src/dist/index.html'));
});

// Custom Error handler
app.use('/', require('./Controllers/ErrorHandler'));

app.listen(port, function () {
    console.log(`Starting the server at port ${port}.`);
});