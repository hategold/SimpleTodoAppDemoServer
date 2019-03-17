const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TodoDetail = new Schema({
    todo_description: {
        type: String
    },
    todo_responsible: {
        type: String
    },
    todo_createDate: {
        type: Date
    },
    todo_tags: {
        type: Array
    }
});

module.exports = mongoose.model('TodoDetail', TodoDetail);