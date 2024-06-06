const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who commented
    comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true }, 
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },// Reference to the post commented on
    content: { type: String, required: true }, // Content of the comment
    createdAt: { type: Date, default: Date.now }, // Timestamp of comment creation
});

module.exports = mongoose.model('ResponseComment', commentSchema);

