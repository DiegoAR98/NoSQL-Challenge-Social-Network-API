// Import the User model.
const { User } = require('../models');

const userController = {
    // Get all users
    getAllUsers(req, res) {
        User.find({})
            .populate({ path: 'thoughts', select: '-__v' }) // Exclude the version key from thoughts
            .populate({ path: 'friends', select: '-__v' }) // Exclude the version key from friends
            .select('-__v') // Exclude the version key from the user object itself
            .then(dbUserData => res.json(dbUserData)) // Return all user data
            .catch(err => {
                console.log(err);
                res.sendStatus(400); // Send a 400 error if something goes wrong
            });
    },

    // Get a single user by ID
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({ path: 'thoughts', select: '-__v' })
            .populate({ path: 'friends', select: '-__v' })
            .select('-__v')
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    // Create a new user
    createUser({ body }, res) {
        User.create(body)
            .then(({ _id }) => User.findOneAndUpdate(
                { _id: body.userId }, // This line seems to contain a logical error: it should target a different collection or field.
                { $push: { users: _id } }, // Push the new user's _id to an array; likely intended for a field that doesn't exist as per the given model and schema.
                { runValidators: true, new: true }
            ))
            .catch(err => res.json(err));
    },

    // Update a user by ID
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, { $set: body }, { new: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },

    // Delete a user by ID
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(deletedUser => {
                if (!deletedUser) {
                    return res.status(404).json({ message: 'No user with this id!' });
                }
                // This section seems to be intended for updating a different document after deleting a user, but it appears logically incorrect as it tries to update the user that was just deleted.
                return User.findOneAndUpdate(
                    { _id: params.id }, 
                    { $pull: { users: params.id } }, 
                    { new: true }
                );
            })
            .catch(err => res.json(err));
    },

    // Add a friend to a user
    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $push: { friends: req.params.friendId } }, // Add a friend's ID to the user's friends list
            { runValidators: true, new: true }
        )
            .populate({ path: 'friends', select: '-__v' })
            .select('-__v')
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    // Remove a friend from a user
    deleteFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } }, // Remove a friend's ID from the user's friends list
            { new: true }
        )
            .populate({ path: 'friends', select: '-__v' })
            .select('-__v')
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    }
}

// Export the user controller.
module.exports = userController;
