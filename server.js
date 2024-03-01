const express = require('express');
const mongoose = require('mongoose');

// Initialize Express app
const server = express();
const SERVER_PORT = process.env.PORT || 3001;

// Middleware for parsing JSON and urlencoded form data
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(express.static('public'));

// MongoDB connection setup
const MONGO_CONNECTION_STRING = process.env.MONGODB_URI || 'mongodb://localhost:27017/socialNetworkAPI';
mongoose.connect(MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Enable debugging for mongoose operations to see what's happening in the background
mongoose.set('debug', true);

// Importing routes
server.use(require('./routes'));

// Start the server
server.listen(SERVER_PORT, () => console.log(`Server is up and running on http://localhost:${SERVER_PORT}`));
