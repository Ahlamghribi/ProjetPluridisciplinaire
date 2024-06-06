const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who reacted
    comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true }, // Reference to the post reacted to
    type: { type: String, enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry','dislike'], required: true }, // Type of reaction
});


module.exports = mongoose.model('ReactionComment', reactionSchema);