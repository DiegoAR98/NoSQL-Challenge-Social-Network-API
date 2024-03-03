// Import and create a new Express router instance.
const router = require('express').Router();

// Destructuring to import thought-related controller functions.
const {
    fetchAllThoughts,
    findThoughtById,
    createThought,
    editThought,
    deleteThought,
    appendReaction,
    detachReaction
} = require('../../controllers/thought-controller');

// Route for fetching all thoughts.
router.route('/')
    .get(fetchAllThoughts); // GET request to fetch all thoughts.

// Route for creating a new thought associated with a userId.
router.route('/:userId')
    .post(createThought); // POST request to create a new thought.

// Routes for operations on a specific thought by its id.
router.route('/:id')
    .get(findThoughtById) // GET request to find a thought by its id.
    .put(editThought) // PUT request to edit/update a thought.
    .delete(deleteThought); // DELETE request to remove a thought.

// Route for appending a reaction to a thought.
router.route('/:thoughtId/reactions')
    .post(appendReaction); // POST request to add a reaction to a thought.

// Route for detaching/removing a reaction from a thought.
router.route('/:thoughtId/reactions/:reactionId')
    .delete(detachReaction); // DELETE request to remove a reaction from a thought.

// Export the router for use in other parts of the application.
module.exports = router;
