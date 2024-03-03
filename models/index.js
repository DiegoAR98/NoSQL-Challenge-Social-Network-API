// Import the User model from the User.js file.
const User = require('./User');
// Import the Thought model from the Thought.js file.
const Thought = require('./Thought');

// Export the imported models as a part of an object to be used elsewhere in the application.
module.exports = { User, Thought };
