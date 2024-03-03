// Import necessary functions and types from mongoose and a custom date formatting utility.
const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

// Define a schema for reactions, to be embedded in thoughts.
const ReactionSchema = new Schema(
    {
        // Custom ID to differentiate from the parent thought's ID.
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId() // Generates a new unique ID.
        },
        reactionBody: {
            type: String,
            required: true, // This field is required.
            maxLength: 280 // Limits the length to mimic Twitter's character limit.
        },
        username: {
            type: String,
            required: true, // This field is required.
        },
        createdAt: {
            type: Date,
            default: Date.now, // Automatically sets to the current date and time.
            get: createdAtVal => dateFormat(createdAtVal) // Formats the date when retrieved.
        }
    },
    {
        toJSON: {
            getters: true // Enables the use of getter functions when converting to JSON.
        }
    }
);

// Define the schema for thoughts.
const ThoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true, // This field is required.
            trim: true, // Trims whitespace from the beginning and end.
            minLength: 1, // Ensures the thought is not empty.
            maxLength: 280 // Limits length to mimic Twitter's character limit.
        },
        createdAt: {
            type: Date,
            default: Date.now, // Automatically sets to the current date and time.
            get: createdAtVal => dateFormat(createdAtVal) // Formats the date when retrieved.
        },
        username: {
            type: String,
            required: true, // This field is required.
        },
        // Embeds the ReactionSchema to validate data for reactions.
        reactions: [ReactionSchema]
    },
    {
        toJSON: {
            virtuals: true, // Enable the use of virtual properties.
            getters: true // Enable the use of getter functions.
        },
        id: false // Prevents the virtual `id` field from being created.
    }
);

// Virtual property to get the total count of reactions for a thought.
ThoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

// Compile the Thought model from the schema.
const Thought = model('Thought', ThoughtSchema);

// Export the Thought model.
module.exports = Thought;
