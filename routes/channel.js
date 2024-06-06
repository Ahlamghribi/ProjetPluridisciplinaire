const express = require('express');
const router = express.Router();
const Channel = require('../models/channel');
const Server = require('../models/servers');
router.post('/:serverId/channel/create', async (req, res) => {
    const { serverId } = req.params;
    const { name } = req.body;
    try {
      const server = await Server.findById(serverId);
      if (!server) {
        return res.status(404).json({ message: 'Server not found' });
      }
      const channel = new Channel({ name, server: serverId });
      await channel.save();
      res.status(201).json(channel);
      server.channels.push(channel._id);
      await server.save();
  
  
    } catch (error) {
      console.error('Error creating channel:', error);
      res.status(500).json({ message: 'Failed to create channel' });
    }
  });
  
router.get('/channels', async (req, res) => {
  try {
    const channels = await Channel.find();
    res.status(200).json(channels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch channels' });
  }
});

router.delete('/channels/:id', async (req, res) => {
  const channelId = req.params.id;
  try {
      // Check if the channel exists
      const channel = await Channel.findById(channelId);
      if (!channel) {
          return res.status(404).json({ message: 'channel not found' });
      }

      // Delete the delete
      await Channel.findByIdAndDelete(channelId);

      res.status(200).json({ message: 'Channel deleted successfully', server });
  } catch (error) {
      console.error('Error deleting channel:', error);
      res.status(500).json({ message: 'Failed to delete channel' });
  }
});

module.exports = router;