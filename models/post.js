const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    user: { type: String, ref: 'User', required: true }, // Reference to the user who created the post
    content: { type: String, required: true }, // Text content of the post
    media: [{ type: String }], // Array of media files (images, videos, PDFs)
    type: { type: String, enum: ['image','video','pdf','text'], default: 'post' },
    likescount: { type: Number, default: 0 }, // Number of likes
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: { type: Number, default: 0 }, // Number of dislikes
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // Array of comments on the post
    createdAt: { type: Date, default: Date.now }, // Timestamp of post creation
    commentsCount: { type: Number, default: 0 },
    category: { type:String, enum: ['foryou','year 1 analyse1', 'info year two', 'info year three'], required: true, ref: 'channel'},

    commentsEnabled: { type: Boolean, default: true },
});


module.exports = mongoose.model('Post', postSchema);