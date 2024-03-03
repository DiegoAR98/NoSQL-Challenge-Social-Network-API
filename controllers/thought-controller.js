// Import the Thought and User models.
const { Thought, User } = require('../models');

const ThoughtManager = {
    // Fetches all thoughts from the database.
    fetchAllThoughts(request, response) {
        Thought.find({})
            .populate('reactions', '-__v') // Populates the reactions field, excluding the version key.
            .select('-__v') // Excludes the version key from the results.
            .then(thoughtData => response.json(thoughtData)) // Sends the fetched data as JSON.
            .catch(error => {
                console.error(error);
                response.status(400).send(); // Sends a 400 status code if an error occurs.
            });
    },
    // Finds a specific thought by its ID.
    findThoughtById({ params }, response) {
        Thought.findById(params.id)
            .populate('reactions', '-__v')
            .select('-__v')
            .then(thoughtData => {
                if (!thoughtData) {
                    response.status(404).json({ message: 'Thought not found' }); // Thought not found handler.
                    return;
                }
                response.json(thoughtData); // Sends the found thought as JSON.
            })
            .catch(error => {
                console.error(error);
                response.status(400).send();
            });
    },
    // Creates a new thought and associates it with a user.
    createThought({ params, body }, response) {
        Thought.create(body)
            .then(({ _id }) => User.findByIdAndUpdate(
                params.userId,
                { $addToSet: { thoughts: _id } }, // Adds the new thought's ID to the user's thoughts array.
                { new: true }
            ))
            .then(thoughtData => response.json(thoughtData)) // Sends the updated user data as JSON.
            .catch(error => response.status(400).json(error));
    },
    // Updates a thought by its ID.
    editThought({ params, body }, response) {
        Thought.findByIdAndUpdate(params.id, body, { new: true, runValidators: true }) // Updates the thought and validates the new data.
            .then(thoughtData => {
                if (!thoughtData) {
                    response.status(404).json({ message: 'No matching thought found' }); // Thought not found handler.
                    return;
                }
                response.json(thoughtData); // Sends the updated thought as JSON.
            })
            .catch(error => response.status(400).json(error));
    },
    // Appends a reaction to a thought.
    appendReaction({ params, body }, response) {
        Thought.findByIdAndUpdate(
            params.thoughtId,
            { $push: { reactions: body } }, // Adds a new reaction to the thought.
            { new: true, runValidators: true }
        )
        .populate('reactions', '-__v')
        .select('-__v')
            .then(thoughtData => {
                if (!thoughtData) {
                    response.status(404).json({ message: 'Thought ID not found' }); // Thought not found handler.
                    return;
                }
                response.json(thoughtData); // Sends the updated thought as JSON.
            })
            .catch(error => response.status(400).json(error));
    },
    // Deletes a thought by its ID.
deleteThought({ params }, response) {
    Thought.findOneAndDelete({ _id: params.id })
        .then(deletedThought => {
            if (!deletedThought) {
                response.status(404).json({ message: 'Thought ID not found' });
                return;
            }
            // Optionally handle the deletion of the thought's reactions if necessary
            response.json({ message: 'Thought successfully deleted' });
        })
        .catch(error => response.status(400).json(error));
},

    // Removes a reaction from a thought.
    detachReaction({ params }, response) {
        Thought.findByIdAndUpdate(
            params.thoughtId,
            { $pull: { reactions: { _id: params.reactionId } } }, // Removes a specific reaction from the thought.
            { new: true }
        )
            .then(thoughtData => {
                if (!thoughtData) {
                    response.status(404).json({ message: 'No matching thought for reaction removal' }); // Thought not found handler.
                    return;
                }
                response.json(thoughtData); // Sends the updated thought as JSON.
            })
            .catch(error => response.status(400).json(error));
    }
};

// Export the ThoughtManager for use elsewhere.
module.exports = ThoughtManager;
