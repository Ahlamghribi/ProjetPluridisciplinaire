const express = require('express');
const router = express.Router();
const Request = require('../models/request');
const User = require('../models/user');
// Send a subscription request
router.post('/request', async (req, res) => {
  const { senderId, recipientId} = req.body;

  try {
    // Check if the request already exists
    const existingRequest = await Request.findOne({ sender: senderId, recipient: recipientId });
    if (existingRequest) {
      return res.status(400).json({ message: 'Request already sent' });
    }

    // Create a new subscription request
    const newRequest = new Request({ sender: senderId, recipient: recipientId });
    await newRequest.save();
    res.status(201).json({ message: 'Request sent successfully' });
  } catch (error) {
    console.error('Error sending subscription request:', error);
    res.status(500).json({ message: 'Failed to send request' });
  }
});

// Accept a subscription request
router.post('/accept', async (req, res) => {
  const { requestId } = req.body;

  try {
    // Find the request and update its status to accepted
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    request.status = 'accepted';
    await request.save();

    // Add the sender as a subscriber
    await User.findByIdAndUpdate(request.sender, { $push: { subscriptions: request.recipient } });

    res.status(200).json({ message: 'Request accepted successfully' });
  } catch (error) {
    console.error('Error accepting subscription request:', error);
    res.status(500).json({ message: 'Failed to accept request' });
  }
});

// Reject a subscription request
router.post('/reject', async (req, res) => {
  const { requestId } = req.body;

  try {
    // Find the request and update its status to rejected
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    request.status = 'rejected';
    await request.save();

    res.status(200).json({ message: 'Request rejected successfully' });
  } catch (error) {
    console.error('Error rejecting subscription request:', error);
    res.status(500).json({ message: 'Failed to reject request' });
  }
});
module.exports=router;