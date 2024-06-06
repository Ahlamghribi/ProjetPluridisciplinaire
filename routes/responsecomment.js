/*const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const ResponseComment = require('../models/ResponseComment');

// Route to create a new comment
router.post('/responsecomments', async (req, res) => {
    try {
        const { user, comment, content } = req.body;
        const newComment = new Comment({ user, comment, content });
        await newComment.save();
        res.status(201).json({ msg: 'Comment response added successfully', comment: newComment });
    } catch (err) {
        console.error('Error adding comment:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;*/
const express = require('express');
const router = express.Router();
const ResponseComment = require('../models/ResponseComment');

// Route to create a new comment response
router.post('/responsecomments', async (req, res) => {
    try {
        const { user, comment, content } = req.body;
        const newComment = new ResponseComment({ user, comment, content });
        await newComment.save();
        res.status(201).json({ msg: 'Comment response added successfully', comment: newComment });
    } catch (err) {
        console.error('Error adding comment response:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
