
const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');
const User = require('../models/user');

// Route pour marquer les notifications comme lues
router.put('/notifications/:notificationId/markAsRead', async (req, res) => {
    try {
        const notificationId = req.params.notificationId;

        // Recherche de la notification dans la base de données
        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ msg: 'Notification not found' });
        }

        // Marquer la notification comme lue
        notification.read = true;
        await notification.save();

        res.json(notification);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la création de la notification de commentaire' });
    }
});


module.exports = router;

