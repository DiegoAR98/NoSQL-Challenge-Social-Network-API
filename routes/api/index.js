// Import and create a new Express router instance.
const router = require('express').Router();

// Import routes for "thoughts" from the thought-routes file.
const thoughtRoutes = require('./thought-routes');

// Import routes for "users" from the user-routes file.
const userRoutes = require('./user-routes');

// Mount the thoughtRoutes on the '/thoughts' path, so all its routes start with '/thoughts'.
router.use('/thoughts', thoughtRoutes);

// Mount the userRoutes on the '/users' path, so all its routes start with '/users'.
router.use('/users', userRoutes);

// Export the router so it can be used in other parts of the application.
module.exports = router;
