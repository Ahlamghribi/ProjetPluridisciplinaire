//ki nlsko khdma nchof si yndero m3a chaque activity ou bien whdhom  
//confirmation apres manlsk khdma 
 const express = require('express');
const router = express.Router();
const Activity = require('../models/activity');

// Route pour enregistrer une activité de commentaire
router.post('/comment', async (req, res) => {
    try {
        const { userId, postId, commentId } = req.body;

        //  une nouvelle activité "comment"
        const activity = new Activity({
            user: userId,
            type: 'comment',
            postId,
            commentId
        });

        // Enregistrez l'activité dans la base de données
        await activity.save();

        res.status(200).json({ message: 'Activité de commentaire enregistrée avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'activité de commentaire' });
    }
});

// Route pour enregistrer une activité de like
router.post('/like', async (req, res) => {
    try {
        const { userId, postId } = req.body;

        //  une nouvelle activité de type "like"
        const activity = new Activity({
            user: userId,
            type: 'like',
            postId
        });

        // Enregistrez l'activité dans la base de données
        await activity.save();

        res.status(200).json({ message: 'Activité de like enregistrée avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'activité de like' });
    }
});

// Route pour enregistrer une activité de partage
router.post('/share', async (req, res) => {
    try {
        const { userId, postId } = req.body;

        //une nouvelle activité de type "partage"
        const activity = new Activity({
            user: userId,
            type: 'partage',
            postId
        });

        // Enregistrez l'activité dans la base de données
        await activity.save();

        res.status(200).json({ message: 'Activité de partage enregistrée avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'activité de partage' });
    }
});
module.exports = router;
