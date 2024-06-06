// routes/post.js

const express = require('express');
const multer = require('multer');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Post = require('../models/post');
const GroupePost = require('../models/GroupePost');
const Groupe = require('../models/Groupe');
const Comment = require('../models/comment');
const Reaction = require('../models/ReactionPost');
const channel = require('../models/channel'); // Corrected model import
const User = require('../models/user');
const ProfileUser = require('../models/ProfileUser');
const Notification = require('../models/notification');


// Route to create a new post
router.post('/posts', [
    // Validation middleware using express-validator
    body('user').notEmpty().withMessage('Selected user is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('category').notEmpty().withMessage('Category is required'), // Corrected field name
    body('media').optional().isArray().withMessage('Media must be an array'),
    body('type').notEmpty().withMessage('Type is required'),
], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Destructure post data from request body
    const { user: nomUtilisateur, content, media, type, category: name } = req.body;
    try {
        // Check if the user exists
        const user = await User.findOne({ nomUtilisateur });
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid user selection' }] });
        }
        
        // Check if the category (channel) exists
        const category = await channel.findOne({ name });
        if (!category) {
            return res.status(404).json({ message: 'Channel not found for the provided category' });
        }
        // Create a new Post instance
        const newPost = new Post({
            user: user.nomUtilisateur,
            content,
            media,
            type,
            category: category.name,
        });
        // Save the post to the database
        const savedPost = await newPost.save();
        await channel.findOneAndUpdate(
            { name: category.name },
            { $push: { posts: savedPost._id } },
            { new: true }
        );
        // Update the user's profile to include the new post
        await ProfileUser.findOneAndUpdate(
            { user: user.nomUtilisateur },
            { $push: { posts: savedPost._id } }, // Add the post to the user's posts array
            { new: true }
        );

        // Send notifications to followers of the user
        const followers = user.followers;
        const notificationMessage = `Votre ami ${user.nomUtilisateur} a publié un nouveau post.`;
        followers.forEach(async (followerId) => {
            // Create notification
            const notification = new Notification({
                recipient: followerId,
                message: notificationMessage,
                postId: savedPost._id,
                type: 'new_post',
                read: false
            });
            await notification.save();
            // Emit notification using Socket.IO or other real-time communication method
            req.io.to(followerId).emit('notification', notification);
        });

        // Send success response
        res.status(201).json({ msg: 'Post created successfully', post: savedPost });
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});
// Route to create a new group post
router.post('/groupeposts/:username/:groupId', upload.single('media'), [
    // Validation middleware using express-validator
    body('content').notEmpty().withMessage('Content is required'),
    body('category').notEmpty().withMessage('Category is required').isIn(['post', 'question', 'answer']).withMessage('Invalid category'),
    body('media').optional().isArray().withMessage('Media must be an array'),
    body('type').notEmpty().withMessage('Type is required').isIn(['image', 'video', 'pdf', 'text']).withMessage('Invalid type'),
], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Extract post data from request body and parameters
    const { content, category, media, type } = req.body;
    const { username, groupId } = req.params;
    try {
        // Check if the user is a member of the group
        const groupe = await Groupe.findById(groupId);
        if (!groupe) {
            return res.status(404).json({ msg: 'Group not found' });
        }

        // Retrieve the user's role from their profile
        const user = await User.findOne({ nomUtilisateur: username });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const role = user.role;

        // Check if the user is allowed to post based on their role and category
        if ((role === 'professeur' && category === 'question') ||
        (role === 'etudiant' && category === 'answer')||
        (role === 'etudiant' && category === 'post')) {
        return res.status(403).json({ msg: 'You are not allowed to post in this category' });
    }

    // Create a new GroupePost instance
    const newGroupePost = new GroupePost({
        user: user.nomUtilisateur,
        content,
        category,
        media,
        type,
        groupe: groupId,
    });
    // Save the post to the database
    const savedPost = await newGroupePost.save();

 // envoyer  notifications to group 
 const groupMembers = groupe.members;
 const notificationMessage = `Un nouveau post a été publié dans le groupe ${groupe.name}.`;
 groupMembers.forEach(async (memberId) => {
     // Crier notification
     const notification = new Notification({
         recipient: memberId,
         message: notificationMessage,
         postId: savedPost._id,
         type: 'new_group_post',
         read: false
     });
     await notification.save();
  
     req.io.to(memberId).emit('notification', notification);
 });

    // Send success response
    res.status(201).json({ msg: 'Group post created successfully', post: savedPost });
} catch (err) {
    console.error('Error creating group post:', err);
    res.status(500).json({ msg: 'Server error' });
}
});
// Route to get posts for a user and channel
router.get('/posts/1/:user/:channelId',async (req, res) => {
const user = req.params.user;
const channelId = req.params.channelId;
try {
    // Find the user's profile
    const userProfile = await ProfileUser.findOne({ user: user });
    if (!userProfile) {
        return res.status(404).json({ msg: 'User profile not found' });
    }
    // Find the posts for the specified channel that the user hasn't viewed
    const posts = await Post.find({ category: channelId, _id: { $nin: userProfile.viewedPosts } });
    res.status(200).json(posts);
} catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ msg: 'Server error' });
}
});
// Route to update a post by ID
router.put('/posts/:postId', upload.single('media'),async (req, res) => {
    try {
        const { content, media } = req.body;
        const postId = req.params.postId;
        const username = req.query.username; // Retrieve username from query parameter
        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // Check if the user exists
        const user = await User.findOne({ nomUtilisateur: username });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        // Check if the user is the creator of the post
        if (post.user !== username) {
            return res.status(401).json({ msg: 'Unauthorized: Only the creator of the post can update it' });
        }
        // Update the post content
        const updatedPost = await Post.findByIdAndUpdate(postId, { content, media }, { new: true });
        res.json({ msg: 'Post updated successfully', post: updatedPost });
    } catch (err) {
        console.error('Error updating post:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Route to delete a post by ID
router.delete('/posts/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const username = req.query.username; // Retrieve username from query parameter
        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        // Check if the requesting user is the owner of the post
        if (post.user !== username) {
            return res.status(401).json({ msg: 'Unauthorized: You are not the owner of this post' });
        }
        // Delete the post
        const deletedPost = await Post.findByIdAndDelete(postId);
        if (!deletedPost) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.json({ msg: 'Post deleted successfully' });
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});
// router to disable the comments
router.put('/posts/:postId/comments', async (req, res) => {
    try {
        const postId = req.params.postId;
        const username = req.query.username; // Retrieve username from query parameter
        const { commentsEnabled } = req.body;
        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
   // Check if the requesting user is the owner of the post
   if (post.user !== username) {
    return res.status(401).json({ msg: 'Unauthorized: You are not the owner of this post' });
}
// Update the comments status of the post
post.commentsEnabled = commentsEnabled;
await post.save();

res.json({ msg: 'Comments status updated successfully', post });
} catch (err) {
console.error('Error updating comments status:', err);
res.status(500).json({ msg: 'Server error' });
}
});
// Route to mark a post as viewed by a user with circular buffer behavior
router.post('/posts/:userId/:postId/view', async (req, res) => {
    const userId = req.params.userId;
    const postId = req.params.postId;

    try { 
        // Find the user's profile
        const userProfile = await ProfileUser.findOne({ user: userId });

        if (!userProfile) {
            return res.status(404).json({ msg: 'User profile not found' });
        }
         // Define the maximum number of viewed posts to keep (e.g., 200 posts)
         const maxViewedPosts = 200;
        // Get the current viewed posts array from the profile
        let viewedPosts = userProfile.viewedPosts || [];
         // Add the new post ID to the viewed posts array (circular buffer behavior)
         if (viewedPosts.length >= maxViewedPosts) {
            // If the viewed posts array is full, remove the oldest post ID (first element)
            viewedPosts.shift(); // Remove the oldest viewed post
        }
         // Add the new post ID to the end of the viewed posts array
         viewedPosts.push(postId);

         // Update the user's profile with the updated viewed posts array
         await ProfileUser.findOneAndUpdate(
            { user: userId },
            { viewedPosts },
            { new: true }
        );
        res.status(200).json({ msg: 'Post marked as viewed successfully' });
    } catch (err) {
        console.error('Error marking post as viewed:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Route to get posts for the "For You" page (posts from subscribed users)
router.get('/posts/2/foryou/:user', async (req, res) => {
    const currentUser = req.params.user;

    try {
          // Find the current user's subscriptions
          const user = await User.findOne({ nomUtilisateur: currentUser });
          if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const subscribedUserIds = user.subscriptions;
         // Retrieve usernames corresponding to the subscribed user IDs
         const subscribedUsers = await User.find({ _id: { $in: subscribedUserIds } }).select('nomUtilisateur');
         const subscribedUsernames = subscribedUsers.map(user => user.nomUtilisateur);
           // Fetch posts from users that the current user is subscribed to
        const posts = await Post.find({ user: { $in: subscribedUsernames } });

           // Mark posts as viewed for the current user
           const userProfile = await ProfileUser.findOne({ user: currentUser });
           if (userProfile) {
               userProfile.viewedPosts = userProfile.viewedPosts.concat(posts.map(post => post._id));
               await userProfile.save();
           }
   
           res.status(200).json(posts);
       } catch (err) {
        console.error('Error fetching posts for "For You" page:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Route to get group posts  (posts from subscribed groups)
router.get('/groupeposts/foryou/:user', async (req, res) => {
    const currentUser = req.params.user;
    try {
           // Find the current user's subscriptions
           const user = await User.findOne({ nomUtilisateur: currentUser });
           if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const subscribedGroupIds = user.subscribedGroups;

        // Retrieve group names corresponding to the subscribed group IDs
        const subscribedGroups = await Groupe.find({ _id: { $in: subscribedGroupIds } }).select('name');

        const subscribedGroupNames = subscribedGroups.map(group => group.name);

        // Fetch group posts from groups that the current user is subscribed to
        const groupePosts = await GroupePost.find({ groupe: { $in: subscribedGroupNames } });

        // Mark group posts as viewed for the current user
        const userProfile = await ProfileUser.findOne({ user: currentUser });
        if (userProfile) {
            const viewedGroupPostIds = groupePosts.map(post => post._id);
            userProfile.viewedPosts = userProfile.viewedPosts.concat(viewedGroupPostIds);
            await userProfile.save();
        }
        res.status(200).json(groupePosts);
    } catch (err) {
        console.error('Error fetching group posts for "For You" page:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});
router.post('/posts/:postId/reactions', async (req, res) => {
    try {
        const { type } = req.body;
        const postId = req.params.postId;
        const username = req.query.username; // Retrieve username from query parameter
 // Check if the post exists
 const post = await Post.findById(postId);
 if (!post) {
     return res.status(404).json({ msg: 'Post not found' });
 }
 // Find the user based on the provided username
 const user = await User.findOne({ nomUtilisateur: username });
 if (!user) {
     return res.status(404).json({ msg: 'User not found' });
 }
  // Check if the user has already reacted to this post
  const existingReaction = await Reaction.findOne({ user: user._id, post: postId });
  if (existingReaction) {
      return res.status(400).json({ msg: 'User has already reacted to this post' });
  }
   // Create a new Reaction instance
   const newReaction = new Reaction({ user: user._id, post: postId, type });
   await newReaction.save();

   // Update likes count and track users who liked the post
   if (type === 'like') {
       post.likesCount++;
       post.likes = post.likes || []; // Initialize likes array if it's undefined
       post.likes.push(user._id);
   } else if (type === 'dislike') {
       post.dislikes++;
   }

   await post.save();

   res.status(201).json({ msg: 'Reaction added successfully', reaction: newReaction });
} catch (err) {
    console.error('Error adding reaction:', err);
    res.status(500).json({ msg: 'Server error' });
}
});



// ajouter un poste vers favorites posts 


// Route pour enregistrer ou désenregistrer un post comme favori
router.post('/save', async (req, res) => {
    const { postId, userId } = req.body;
    

    try {
        // Vérifier si le post est déjà enregistré comme favori par l'utilisateur
        const existingFavorite = await Favorite.findOne({ user: userId, post: postId });
        if (existingFavorite) {
            // Le post est déjà enregistré, donc désenregistrez-le
            await Favorite.findByIdAndDelete(existingFavorite._id);
            return res.status(200).send('Le post a été désenregistré des favoris.');
        } else {
            // Le post n'est pas enregistré, donc enregistrez-le
            const favorite = new Favorite({
                user: userId,
                post: postId
            });
            await favorite.save();
            return res.status(201).send('Le post a été enregistré dans les favoris.');
        }
    } catch (err) {
        console.error('Erreur lors de la gestion des favoris :', err);
        res.status(500).send('Erreur lors de la gestion des favoris.');
    }
});


module.exports = router;
