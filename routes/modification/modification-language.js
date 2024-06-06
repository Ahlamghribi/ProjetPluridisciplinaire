
const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const language = require('../../models/Language');

// route modification de la langue
router.put('/users/:userId/language', async (req, res) => {
  try {
    const { userId } = req.params;
    const { language } = req.body;

    // Vérifier si l'utilisateur existe avec son id 
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Mettre à jour la langue de l'utilisateur
    user.language = language;
    await user.save();

    res.status(200).json({ message: 'Langue utilisateur mise à jour avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la langue utilisateur' });
  }
});

module.exports = router;

