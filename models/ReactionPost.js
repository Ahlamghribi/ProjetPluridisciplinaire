const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who reacted
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }, // Reference to the post reacted to
    type: { type: String, enum: ['like', 'dislike'], required: true }, // Type of reaction
});

module.exports = mongoose.model('ReactionPost', reactionSchema);

