const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');

// Route pour la modification du mot de passe
//cette fct passport.autheticate pour l'authentification de l'utilisateur en utilise jwt et pour que seule l'utilisateur qui est connecté avec ce compte peut modifier le mot de passe 
//strategie jwt dans fichier config 
router.put('/password', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      // dans postman on ecris le token dans "headers autorization bearer token" (ki ndir login y3toni token )
        const userId = req.user._id;
        const { oldPassword, newPassword, confirmPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // compare password
        if (!bcrypt.compareSync(oldPassword, user.motDePasse)) {
            return res.status(401).json({ message: 'Ancien mot de passe incorrect' });
        }

        // nv password with confirm password 
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'La confirmation du mot de passe ne correspond pas' });
        }

        // Hacher et enregistrer le nouveau mot de passe
        user.motDePasse = bcrypt.hashSync(newPassword, 10);
        await user.save();

        res.status(200).json({ message: 'Mot de passe modifié avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur lors de la modification du mot de passe' });
    }
});

module.exports = router;
