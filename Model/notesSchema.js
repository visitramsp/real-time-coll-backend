const { required } = require('joi');
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: { type: String, default: '' },
    updatedAt: { type: Date, default: Date.now },
});

const noteModel = mongoose.model('Note', noteSchema);

module.exports = noteModel;