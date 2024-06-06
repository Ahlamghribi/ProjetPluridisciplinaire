// Dans votre fichier routes/user.js

const express = require('express');
const router = express.Router();
const User = require('../../models/user');

//verification by id 
// modification du nom
router.put('/updatename/:userId/nom', async (req, res) => {
    try {
        const { userId } = req.params;
        const { newName } = req.body;

        // Mettez à jour le nom de l'utilisateur dans la base de données
        await User.findByIdAndUpdate(userId, { nom: newName });

        res.status(200).json({ message: 'Nom modifié avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur lors de la modification du nom' });
    }
});

//modification de prenom 
router.put('/updatelastname/:userId/prenom', async (req, res) => {
    try {
        const { userId } = req.params;
        const { newFirstName } = req.body;

        // Mettez à jour le prénom de l'utilisateur dans la base de données
        await User.findByIdAndUpdate(userId, { prenom: newFirstName });

        res.status(200).json({ message: 'Prénom modifié avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur lors de la modification du prénom' });
    }
});

//modification de nom d'utilisateur 
router.put('/updateusername/:userId/username', async (req, res) => {
    try {
        const { userId } = req.params;
        const { newUsername } = req.body;

        // Mettez à jour le nom d'utilisateur de l'utilisateur dans la base de données
        await User.findByIdAndUpdate(userId, { username: newUsername });

        res.status(200).json({ message: 'Nom d\'utilisateur modifié avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur lors de la modification du nom d\'utilisateur' });
    }
});


module.exports = router;
