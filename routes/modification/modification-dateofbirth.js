
const express = require('express');
const router = express.Router();
const User = require('../../models/user');

/////     kkkkkk
//  la modification de la date de naissance
router.put('/modification-naissance/:userId', async (req, res) => {
    try {
    
        const { userId } = req.params;
        const { newDateOfBirth } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Mettre à jour la date de naissance de l'utilisateur avec la nouvelle valeur
        user.dateDeNaissance = newDateOfBirth;

        await user.save();

        res.status(200).json({ message: 'Date de naissance modifiée avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la modification de la date de naissance' });
    }
});


module.exports = router;
