const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who commented
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }, // Reference to the post commented on
    content: { type: String, required: true }, // Content of the comment
    reactioncount: { type: Number, default: 0 },
    reaction: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ReactionComment' }],
    responses : [{ type: mongoose.Schema.Types.ObjectId, ref: 'ResponseComment' }],
    createdAt: { type: Date, default: Date.now }, // Timestamp of comment creation
});

module.exports = mongoose.model('Comment', commentSchema);