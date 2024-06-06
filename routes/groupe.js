const express = require('express');
const router = express.Router();
const Groupe = require('../models/Groupe');
const User = require('../models/user');
// Create a group
router.post('/groups', async (req, res) => {
  try {
    const { name, creator, members } = req.body;
    const newGroupe = new Groupe({ name, creator, members });
    const savedGroupe = await newGroupe.save();
    res.status(201).json(savedGroupe);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a member to the group
router.post('/groups/:groupId/members/:username', async (req, res) => {
    try {
      const username = req.params.username;
      const groupId = req.params.groupId;
      
      // Get the user making the request
      const requester = req.user; // Assuming you have middleware to authenticate users and add them to the request object
      // Find the group
      const groupe = await Groupe.findById(groupId);
      if (!groupe) {
        return res.status(404).json({ message: 'Group not found' });
      }
      // Check if the requester is the creator of the group
      if (requester._id !== groupe.creator) {
        return res.status(403).json({ message: 'Only the creator can add members to the group' });
      }
      // Find the user to be added as a member
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      // Add the user as a member to the group
      groupe.members.push(user._id);
      const updatedGroupe = await groupe.save();
      
      res.status(200).json(updatedGroupe);
    } catch (error) {
      console.error('Error adding member to group:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  module.exports = router;