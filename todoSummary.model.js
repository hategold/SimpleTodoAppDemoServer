const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TodoSummary = new Schema({
    todo_title: {
        type: String
    },
    todo_dueDate: {
        type: Date
    },
    todo_priority: {
        type: String
    },
    todo_detail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TodoDetail'
    },
    todo_completed: {
        type: Boolean
    }
});

module.exports = mongoose.model('TodoSummary', TodoSummary);