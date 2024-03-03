// Import and create a new Express router instance.
const router = require('express').Router();

// Import the API routes from the 'api' directory.
const apiRoutes = require('./api');

// Middleware to use the API routes for any request that starts with '/api'.
router.use('/api', apiRoutes);

// Middleware for handling 404 errors for any routes not previously matched.
router.use((req, res) => {
    res.status(404).send('<h1>404 Error!</h1>');
});

// Export the router for use in other parts of the application.
module.exports = router;
