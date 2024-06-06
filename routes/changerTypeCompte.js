const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const passport = require('../config/passport-config');

// Modifier le paramètre de confidentialité du compte utilisateur (public/privé)
router.put('/update-privacy', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const userId = req.user._id;
        const { privacy } = req.body;
        
        // Vérifier si l'utilisateur existe avec l'ID (JWT)
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: 'Utilisateur non trouvé' });
        }

        // Mettre à jour le paramètre de confidentialité du compte utilisateur
        user.privacy = privacy;
        await user.save();

        res.status(200).json({ message: 'Paramètre de confidentialité du compte utilisateur mis à jour avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du paramètre de confidentialité du compte utilisateur' });
    }
});

// pour que juste les amis peut voir le contenu de mon profil 
router.get('/profile/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const viewerId = req.user ? req.user._id : null; // Vérifier si req.user est défini

        // Vérifier si l'utilisateur existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifier si le profil est privé
        if (user.privacy === 'private') {
            // Vérifier si le viewer est un ami de l'utilisateur
            if (!viewerId || (user.subscribers && user.subscribers.includes(viewerId))) { // Vérifier si user.subscribers est défini si n'est pas defini cad m3ndoch amis kml 
                return res.status(401).json({ message: 'Ce profil est privé' });
            }
        }

        // Retourner les détails du profil utilisateur
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur lors de la récupération des détails du profil utilisateur' });
    }
});

module.exports = router;