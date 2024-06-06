const express = require('express');
const router = express.Router();
const ReactionPost = require('../models/ReactionPost');
const Post = require('../models/post');
const Notification = require('../models/notification');
// Route to create a new reaction
router.post('/reactionposts', async (req, res) => {
    try {
        const { user: reactingUserId, post: postId, type } = req.body;

        // Create a new reaction
        const newReaction = new ReactionPost({ user: reactingUserId, post: postId, type });
        await newReaction.save();

        // Update the like/dislike count of the post
        const updateField = type === 'like' ? 'likes' : 'dislikes';
        await Post.findByIdAndUpdate(postId, { $inc: { [updateField]: 1 } });

        // recupere le post et li criyah 
        const post = await Post.findById(postId).populate('user');

        // Send a notification to the post author
        const notification = new Notification({
            recipient: post.user._id,
            sender: reactingUserId,
            postId: postId,
            type: type === 'like' ? 'like' : 'dislike', 
            message: `Votre post a reçu une nouvelle réaction: ${type}`,
            read: false
        });
        await notification.save();

        //envoyer les notif  in real time
        req.io.to(post.user._id.toString()).emit('notification', notification);

        res.status(201).json({ msg: 'Reaction added successfully', reaction: newReaction });
    } catch (err) {
        console.error('Error adding reaction:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
