const mongoose = require('mongoose');
const groupepostSchema = new mongoose.Schema({
    user: { type: String, ref: 'User', required: true }, // Reference to the user who created the post
    content: { type: String, required: true }, // Text content of the post
    media: [{ type: String }], // Array of media files (images, videos, PDFs)
    type: { type: String, enum: ['image', 'video', 'pdf', 'text'], default: 'text' },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CommentGroupe' }], // Array of comments on the post
    createdAt: { type: Date, default: Date.now }, // Timestamp of post creation
    category: { type: String, enum: ['post', 'question', 'answer'], required: true },
    groupe: { type: String, ref: 'Groupe', required: true },
    commentsEnabled: { type: Boolean, default: true },
});

module.exports = GroupePost = mongoose.model('GroupePost', groupepostSchema);