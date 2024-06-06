
const express = require('express');
const router = express.Router();
//car y a dossier dakhel dossier lazem ndir heka 
const User = require('../../models/user');
// Route de modification d'e-mail
router.put('/update-email', async (req, res) => {
    try {
        //users put currentemail et newemail
        const { currentEmail, newEmail } = req.body;

        // Vérifier si l'utilisateur existe avec l'email actuel
        const user = await User.findOne({ email: currentEmail });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé avec cette adresse e-mail' });
        }

        // Mettre à jour l'email de l'utilisateur
        user.email = newEmail;
        await user.save();

        res.status(200).json({ message: 'Adresse e-mail mise à jour avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'adresse e-mail' });
    }
});

module.exports = router;
