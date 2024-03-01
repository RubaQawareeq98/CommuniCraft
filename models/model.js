const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    body: {
        required: true,
        type: String
    },
    title: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('Data', dataSchema)