const express = require('express');
const router = express.Router();
const ReactionComment = require('../models/ReactionComment');

// Route to create a new reaction
router.post('/reactioncomments', async (req, res) => {
    try {
        const { user, comment, type } = req.body;
        const newReaction = new ReactionComment({ user, comment, type });
        await newReaction.save();
        res.status(201).json({ msg: 'Reaction added successfully', reaction: newReaction });
    } catch (err) {
        console.error('Error adding reaction:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;