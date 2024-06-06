const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

// Bloquer un utilisateur
router.put('/block/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const userId = req.user._id;
        const { username } = req.params;

        // Vérifier si l'utilisateur existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifier si l'utilisateur à bloquer existe
        const userToBlock = await User.findOne({ username });
        if (!userToBlock) {
            return res.status(404).json({ message: 'Utilisateur à bloquer non trouvé' });
        }

        // Vérifier si l'utilisateur à bloquer n'est pas déjà bloqué
        if (user.blockedUsers.includes(userToBlock._id)) {
            return res.status(400).json({ message: 'Cet utilisateur est déjà bloqué' });
        }

        // Ajouter l'utilisateur à bloquer à la liste des utilisateurs bloqués
        user.blockedUsers.push(userToBlock._id);

        // Supprimer toutes les notifications envoyées par l'utilisateur bloqué
         await Notification.deleteMany({ sender: userToBlock._id });

        // Supprimer tous les likes de l'utilisateur bloqué
         await Like.deleteMany({ user: userToBlock._id });
        
        // Supprimer tous les commentaires de l'utilisateur bloqué
         await Comment.deleteMany({ user: userToBlock._id });
        
        // Mettre à jour les publications de l'utilisateur bloqué pour qu'il ne puisse plus les voir
         await Publication.updateMany({ user: userToBlock._id }, { $set: { isBlocked: true } });
        await user.save();

        res.status(200).json({ message: 'Utilisateur bloqué avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur lors du blocage de l\'utilisateur' });
    }
});

// Débloquer un utilisateur
router.put('/unblock/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const userId = req.user._id;
        const { username } = req.params;

        // Vérifier si l'utilisateur existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifier si l'utilisateur à débloquer existe
        const userToUnblock = await User.findOne({ username });
        if (!userToUnblock) {
            return res.status(404).json({ message: 'Utilisateur à débloquer non trouvé' });
        }

        // Vérifier si l'utilisateur à débloquer est bloqué
        if (!user.blockedUsers.includes(userToUnblock._id)) {
            return res.status(400).json({ message: 'Cet utilisateur n\'est pas bloqué' });
        }

        // Retirer l'utilisateur à débloquer de la liste des utilisateurs bloqués
        user.blockedUsers = user.blockedUsers.filter(id => id.toString() !== userToUnblock._id.toString());
        await user.save();


       // Retirer l'utilisateur bloquant de la liste des utilisateurs bloqués de l'utilisateur à débloquer
        userToUnblock.blockedUsers = userToUnblock.blockedUsers.filter(id => id.toString() !== user._id.toString());
        await userToUnblock.save();


        res.status(200).json({ message: 'Utilisateur débloqué avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur lors du déblocage de l\'utilisateur' });
    }
});

module.exports = router;
