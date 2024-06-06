const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const CommentGroupe = require('../models/comment');
const Post = require('../models/post');
const ResponseComment = require('../models/CommentGroupe');
const ReactionComment = require('../models/ReactionComment');
const Notification = require('../models/Notification');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');

// Route to create a new comment
router.post('/comments', async (req, res) => {
    try {
        const { user, post, content } = req.body;
        const newComment = new Comment({ user, post, content });
        await newComment.save();

        // Create a notification for the post author
        const postAuthor = await Post.findById(post).populate('user');
        if (postAuthor) {
            const notification = new Notification({
                recipient: postAuthor.author._id,
                sender: user,
                postId: post,
                type: 'comment',
                message: 'New comment on your post',
                read: false
            });
            await notification.save();

            //envoyer la notif on utilise la bib socket avec sa methode .to nhato fiha le distinaire (postauthor.user) donne l id et converti avec tostring pour donne chaine  et .emit hiya li tb3et lal li rah f .to 
            req.io.to(postAuthor.user._id.toString()).emit('notification', notification);
        }

        res.status(201).json({ msg: 'Comment added successfully', comment: newComment });
    } catch (err) {
        console.error('Error adding comment:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Route to create a new groupecomment
router.post('/groupecomments', async (req, res) => {
    try {
        const { user, post, content, groupe } = req.body;
        const newCommentGroupe = new CommentGroupe({ user, post, content, groupe });
        await newCommentGroupe.save();

        // Create a notification for the post author
        const postAuthor = await Post.findById(post).populate('user');
        if (postAuthor) {
            const notification = new Notification({
                recipient: postAuthor.author._id,
                sender: user,
                postId: post,
                type: 'comment',
                message: 'New comment on your group post',
                read: false
            });
            await notification.save();
            req.io.to(postAuthor.user._id.toString()).emit('notification', notification);
        }

        res.status(201).json({ msg: 'Comment added successfully', comment: newCommentGroupe });
    } catch (err) {
        console.error('Error adding comment:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Route to respond to a comment
router.post('/comments/:commentId/:postId/responsecomments', [
    body('content').notEmpty().withMessage('Content is required'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { content } = req.body;
    const commentId = req.params.commentId;
    const postId = req.params.postId;
    const username = req.query.username;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        const user = await User.findOne({ nomUtilisateur: username });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const newResponseComment = new ResponseComment({
            user: user._id,
            content,
            post: postId,
            comment: commentId,
        });

        const savedResponseComment = await newResponseComment.save();

        post.commentsCount++;
        comment.responsecount++;

        // Create a notification for the original comment author
        const notification = new Notification({
            recipient: comment.user,
            sender: user._id,
            postId: postId,
            type: 'response',
            message: 'New response to your comment',
            read: false
        });
        await notification.save();
        req.io.to(comment.user.toString()).emit('notification', notification);

        res.status(201).json({ msg: 'Comment response added successfully', comment: savedResponseComment });
    } catch (err) {
        console.error('Error adding comment response:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Route to add reaction to a comment on a post
router.post('/comments/:commentId/:postId/reactioncomments', async (req, res) => {
    try {
        const { type } = req.body;
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        const username = req.query.username;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }

        const user = await User.findOne({ nomUtilisateur: username });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const existingReaction = await ReactionComment.findOne({ user: user._id, comment: commentId });
        if (existingReaction) {
            return res.status(400).json({ msg: 'User has already reacted to this comment' });
        }

        const newReaction = new ReactionComment({ user: user._id, comment: commentId, type });
        await newReaction.save();

        comment.reactioncount++;
        comment.reaction.push(newReaction);
        await comment.save();

        // Create a notification for the comment author
        const notification = new Notification({
            recipient: comment.user,
            sender: user._id,
            postId: postId,
            type: 'reaction',
            message: 'New reaction to your comment',
            read: false
        });
        //save notif dans bdd 
        await notification.save();
        //pour envoyer la notif 
        req.io.to(comment.user.toString()).emit('notification', notification);

        res.status(201).json({ msg: 'Reaction added successfully', reaction: newReaction });
    } catch (err) {
        console.error('Error adding reaction to comment:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.delete('/comments/:commentId', async (req, res) => {
    const { commentId } = req.params;
    const username = req.query.username;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }

        const user = await User.findOne({ nomUtilisateur: username });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (!comment.user.equals(user._id)) {
            return res.status(401).json({ msg: 'Unauthorized: You do not have permission to delete this comment' });
        }

        await Comment.findByIdAndDelete(commentId);
        res.json({ msg: 'Comment deleted successfully' });
    } catch (err) {
        console.error('Error deleting comment:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;

