const express = require('express');
const Server = require('../models/servers');

const router = express.Router(); 

router.post('/create', async (req, res) => {
    const { name } = req.body;
    try {
        const server = new Server({ name });
        await server.save();
        res.status(201).json(server);
    } catch (error) {
        console.error('Error creating server:', error);
        res.status(500).json({ message: 'Failed to create server' });
    }
});

router.get('/servers', async (req, res) => {
    try {
        const servers = await Server.find();
        res.status(200).json(servers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch servers' });
    }
});

// Route to delete a server by ID
router.delete('/servers/:id', async (req, res) => {
    const serverId = req.params.id;
    try {
        // Check if the server exists
        const server = await Server.findById(serverId);
        if (!server) {
            return res.status(404).json({ message: 'Server not found' });
        }

        // Delete the server
        await Server.findByIdAndDelete(serverId);

        res.status(200).json({ message: 'Server deleted successfully', server });
    } catch (error) {
        console.error('Error deleting server:', error);
        res.status(500).json({ message: 'Failed to delete server' });
    }
});

module.exports = router;
