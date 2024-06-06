const express = require('express');
const router = express.Router();
const ProfileUser = require('../models/ProfileUser');
//const Subscription = require('../models/Subscription');
// Route to update user profile
router.put('/profile/:user', async (req, res) => {
    const { bio, profilePhoto } = req.body;
    const user = req.params.user;
    try {
        // Find the profile user by user ID
        let profileUser = await ProfileUser.findOne({ user: user  });
        if (!profileUser) {
            return res.status(404).json({ msg: 'Profile not found' });
        }
        // Update bio and profile photo
        if (bio) {
            profileUser.bio = bio;
        }
        if (profilePhoto) {
            profileUser.profilePhoto = profilePhoto;
        }
        // Save the updated profile user
        await profileUser.save();
        res.json({ msg: 'Profile updated successfully', profileUser });
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});


module.exports = router;