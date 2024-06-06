 //verifier avec model post (ouissal)
 const express = require('express');
const router = express.Router();
//const Post = require('../models/post');
const Search = require('../models/search');

// Route de recherche de posts par mot clé dans le bio
router.get('/search', async (req, res) => {
   /* try {
        const { keyword } = req.query.trim(); // Supprimez les espaces blancs avant et après le mot-clé

        // Recherche des posts dont le bio contient le mot-clé (insensible à la casse)
        const posts = await Post.find({ 
            bio: { $regex: keyword, $options: 'i' } ,
            user: { $nin: req.user.blockedUsers }
        });

        console.log("Résultats de la recherche :", posts); // Affichez les résultats dans la console

        // Enregistrez la recherche dans l'historique
        const userId = req.user._id; // Récupérez l'ID de l'utilisateur qui effectue la recherche
        const search = new Search({ user: userId, keyword });
        await search.save();

        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la recherche des posts' });
    }
    */
});

module.exports = router;
