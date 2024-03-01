const { User } = require('../models');

const UserController = {
    // Retrieve all users from the database
    fetchAllUsers(request, response) {
        User.find({})
            .populate({ path: 'thoughts', select: '-__v' })
            .populate({ path: 'friends', select: '-__v' })
            .select('-__v')
            .then(userData => response.json(userData))
            .catch(error => {
                console.error(error);
                response.sendStatus(400);
            });
    },
    // Find a single user by ID
    findUserById({ params }, response) {
        User.findById(params.id)
            .populate('thoughts', '-__v')
            .populate('friends', '-__v')
            .select('-__v')
            .then(userData => {
                if (!userData) {
                    response.status(404).json({ message: 'User ID not found' });
                    return;
                }
                response.json(userData);
            })
            .catch(error => {
                console.error(error);
                response.sendStatus(400);
            });
    },
    // Create a new user
    addUser({ body }, response) {
        User.create(body)
            .then(newUser => User.findByIdAndUpdate(
                newUser._id,
                { $addToSet: { users: newUser._id } },
                { runValidators: true, new: true }
            ))
            .catch(error => response.status(400).json(error));
    },
    // Update user information
    modifyUser({ params, body }, response) {
        User.findByIdAndUpdate(params.id, body, { new: true, runValidators: true })
            .then(userData => {
                if (!userData) {
                    response.status(404).json({ message: 'User ID not found' });
                    return;
                }
                response.json(userData);
            })
            .catch(error => response.status(400).json(error));
    },
    // Remove a user by ID
    removeUser({ params }, response) {
        User.findByIdAndRemove(params.id)
            .then(removedUser => {
                if (!removedUser) {
                    response.status(404).json({ message: 'User ID not found' });
                    return;
                }
                // Optionally, handle removal of user's thoughts and friends here
                response.json({ message: 'User removed successfully' });
            })
            .catch(error => response.status(400).json(error));
    },
    // Add a friend to a user
    includeFriend(request, response) {
        User.findByIdAndUpdate(
            request.params.userId,
            { $addToSet: { friends: request.params.friendId } },
            { new: true, runValidators: true }
        )
        .populate('friends', '-__v')
        .select('-__v')
        .then(userData => {
            if (!userData) {
                response.status(404).json({ message: 'User ID not found' });
                return;
            }
            response.json(userData);
        })
        .catch(error => response.status(400).json(error));
    },

    // Remove a friend from a user
    excludeFriend(request, response) {
        User.findByIdAndUpdate(
            request.params.userId,
            { $pull: { friends: request.params.friendId } },
            { new: true }
        )
        .populate('friends', '-__v')
        .select('-__v')
        .then(userData => {
            if (!userData) {
                response.status(404).json({ message: 'User ID not found' });
                return;
            }
            response.json(userData);
        })
        .catch(error => response.status(400).json(error));
    }
}

module.exports = UserController;
