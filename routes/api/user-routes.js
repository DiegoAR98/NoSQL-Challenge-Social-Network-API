// Import and create a new Express router instance.
const router = require('express').Router();

// Destructuring to import user-related controller functions.
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend
} = require('../../controllers/user-controller');

// Define routes for the base path. GET for fetching all users, POST for creating a new user.
router
    .route('/')
    .get(getAllUsers) // Route to get all users.
    .post(createUser); // Route to create a new user.

// Define routes for user operations with a specific user ID (/:id).
router
    .route('/:id')
    .get(getUserById) // Route to get a user by their ID.
    .put(updateUser) // Route to update a user by their ID.
    .delete(deleteUser); // Route to delete a user by their ID.

// Define routes for managing friends of a user, identified by userId and friendId.
router
    .route('/:userId/friends/:friendId')
    .post(addFriend) // Route to add a friend to a user.
    .delete(deleteFriend); // Route to delete a friend from a user.

// Export the router for use in other parts of the application.
module.exports = router;
