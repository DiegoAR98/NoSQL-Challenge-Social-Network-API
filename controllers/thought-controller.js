const { Thought, User } = require('../models');

const ThoughtManager = {
    // Retrieve all thoughts from the database
    fetchAllThoughts(request, response) {
        Thought.find({})
            .populate('reactions', '-__v')
            .select('-__v')
            .then(thoughtData => response.json(thoughtData))
            .catch(error => {
                console.error(error);
                response.status(400).send();
            });
    },
    // Find a thought by its unique ID
    findThoughtById({ params }, response) {
        Thought.findById(params.id)
            .populate('reactions', '-__v')
            .select('-__v')
            .then(thoughtData => {
                if (!thoughtData) {
                    response.status(404).json({ message: 'Thought not found' });
                    return;
                }
                response.json(thoughtData);
            })
            .catch(error => {
                console.error(error);
                response.status(400).send();
            });
    },
    // Create a new thought and link it to a user
    createThought({ params, body }, response) {
        Thought.create(body)
            .then(({ _id }) => User.findByIdAndUpdate(
                params.userId,
                { $addToSet: { thoughts: _id } },
                { new: true }
            ))
            .then(thoughtData => response.json(thoughtData))
            .catch(error => response.status(400).json(error));
    },
    // Update an existing thought by its ID
    editThought({ params, body }, response) {
        Thought.findByIdAndUpdate(params.id, body, { new: true, runValidators: true })
            .then(thoughtData => {
                if (!thoughtData) {
                    response.status(404).json({ message: 'No matching thought found' });
                    return;
                }
                response.json(thoughtData);
            })
            .catch(error => response.status(400).json(error));
    },
    // Add a reaction to a thought
    appendReaction({ params, body }, response) {
        Thought.findByIdAndUpdate(
            params.thoughtId,
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
        .populate('reactions', '-__v')
        .select('-__v')
            .then(thoughtData => {
                if (!thoughtData) {
                    response.status(404).json({ message: 'Thought ID not found' });
                    return;
                }
                response.json(thoughtData);
            })
            .catch(error => response.status(400).json(error));
    },
    // Remove a thought by its ID
    deleteThought({ params }, response) {
        Thought.findByIdAndRemove(params.id)
            .then(deletedThought => {
                if (!deletedThought) {
                    response.status(404).json({ message: 'Thought ID not found' });
                    return;
                }
                // Optionally, handle cleanup of any linked reactions or user references
                response.json({ message: 'Thought successfully deleted' });
            })
            .catch(error => response.status(400).json(error));
    },
    // Remove a reaction from a thought
    detachReaction({ params }, response) {
        Thought.findByIdAndUpdate(
            params.thoughtId,
            { $pull: { reactions: { _id: params.reactionId } } },
            { new: true }
        )
            .then(thoughtData => {
                if (!thoughtData) {
                    response.status(404).json({ message: 'No matching thought for reaction removal' });
                    return;
                }
                response.json(thoughtData);
            })
            .catch(error => response.status(400).json(error));
    }
};

module.exports = ThoughtManager;
