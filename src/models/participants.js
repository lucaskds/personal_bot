const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const participantSchema = new Schema(
    {
        userName: {
            type: String,
            required: true
        },
        challengePosition: {
            type: Number,
            required: true
        },
        startScore: {
            type: Number,
            required: false
        },
        completed: {
            type: Number,
            required: false
        },

    }, {collection: 'participants', versionKey: false}
);

const participantModel = mongoose.model('participant', participantSchema)

module.exports = participantModel;
