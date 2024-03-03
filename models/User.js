// Importing Schema and model from mongoose to define our model.
const { Schema, model } = require('mongoose');

// Define the User schema with its fields.
const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true, // Ensures usernames are unique across the collection.
            required: true, // Makes the username a required field.
            trim: true // Trims whitespace from the username.
        },
        email: {
            type: String, // Defines the data type as String.
            trim: true, // Trims whitespace from the beginning and end of the email.
            lowercase: true, // Converts the email to lowercase to ensure data consistency.
            unique: true, // Ensures that each email in the database is unique.
            required: "Email address is required", // Makes the email field required and specifies a custom error message.
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'], // Validates the email format against a regular expression and provides a message for invalid formats.
        },
        
        thoughts: [
            {
                type: Schema.Types.ObjectId, // References Thought documents.
                ref: 'Thought' // Establishes a relationship to the Thought model.
            }
        ],
        friends: [{
            type: Schema.Types.ObjectId, // References User documents for friends.
            ref: 'User' // Establishes a relationship to the User model itself for friends.
        }]
    },
    {
        toJSON: {
            virtuals: true, // Include virtuals when document is converted to JSON.
        },
        id: false // Disables the virtual `id` field to prevent duplication of the `_id` field.
    }
);

// Virtual property to get the total count of friends.
UserSchema.virtual('friendCount').get(function () {
    return this.friends.length; // Calculates the length of the friends array.
});

// Compile and export the User model from the schema definition.
const User = model('User', UserSchema);

module.exports = User;
