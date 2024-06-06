
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Search = require('../models/search');
const passport = require('passport');

//  la recherche d'utilisateurs par nom 
//pour authentificate user 
router.get('/search', passport.authenticate('jwt', { session: false }), async (req, res) => {
        try {
        //query c une chaine de requete dans l'url utilise dans les request get pour recuperer des donnees specifique de l'url comme la recherche des utilisateur par nom 
        //dan l'url apres search?nom= nom que vous voullez (stocke dans params)
        const {nom} = req.query;

        // la recherche dans la base de données
        //§regex :nom specifie le motif de recherche (nom)
        //§option:'i' faire pas la differnece entre les majuscule et miniscule 
        const users = await User.find({ 
            nom: { $regex: nom, $options: 'i' },  
            _id: { $nin: req.user.blockedUsers } // Exclure les utilisateurs bloqués
        });
        console.log("Résultats de la recherche :", users); // Ajoutez cette ligne pour afficher les résultats dans la console

         // Enregistrer la recherche dans l'historique 
         const userId = req.user._id; // Récupérer l'ID de l'utilisateur qui effectue la recherche
         const search = new Search({ user: userId, keyword: nom });
         await search.save();
         
        res.json(users); // retourne profilusers (ouissal) et pas user 
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur lors de la recherche des utilisateurs' });
    }
});

module.exports = router;


