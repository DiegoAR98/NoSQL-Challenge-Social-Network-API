const router = require('express').Router();
const {
    fetchAllThoughts,
    findThoughtById,
    createThought,
    editThought,
    deleteThought,
    appendReaction,
    detachReaction
} = require('../../controllers/thought-controller');

router.route('/')
    .get(fetchAllThoughts);

router.route('/:userId')
    .post(createThought);

router.route('/:id')
    .get(findThoughtById)
    .put(editThought)
    .delete(deleteThought);

router.route('/:thoughtId/reactions')
    .post(appendReaction);

router.route('/:thoughtId/reactions/:reactionId')
    .delete(detachReaction);

module.exports = router;
