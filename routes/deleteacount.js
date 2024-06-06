// routes/user.js

const express = require('express');
const router = express.Router();
//pour le mot de passe 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ProfileUser = require('../models/ProfileUser');
//compte suprimées
const ArchivedUser = require('../models/archivedUser');
const ArchivedProfileUser = require('../models/archivedprofiluser');

const passport = require('../config/passport-config');
//post comment ouissal
//const Post = require('../models/post');
//const Comment = require('../models/comment');

//route delete 
//lazem ouissal dir l'option t3 email ykon khtra whda 
//On utilise jwt pour l'authetification
router.delete('/delete-account', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const userId = req.user._id;
        //saisi password avans supression 
        const { motDePasse } = req.body;
        
        // verifier si l'utilisateur existe avec id (jwt)
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: 'Utilisateur non trouvé' });
        }
       // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(motDePasse, user.motDePasse);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }

        // Archiver le compte utilisateur (dans une autre bdd :archiveduser )
        const archivedUser = new ArchivedUser({
            nom: user.nom,
            prenom:user.prenom,
            username: user.username,  
            dateDeNaissance : user.dateDeNaissance,
            sex: user.sex,
            email: user.email,
            motDePasse : user.motDePasse,
            language: user.language,
            role : user.role,
            subscribersCount : user.subscriptionsCount,
            subscribers : user.subscribers,
            subscriptions : user.subscriptions,
            subscriptionsCount : user.subscriptions,
            privacy : user.privacy, 
            blockedUsers : user.blockedUsers,
            searchHistory : user.searchHistory
        });
        await archivedUser.save() ;
         // Archiver le profil de l'utilisateur
             const ArchivedProfileUser = new ArchivedProfileUser({
                user: ProfileUser.user,
                profilePhoto: ProfileUser.profilePhoto,
                bio:ProfileUser.bio,
                role: ProfileUser.role,
                posts: ProfileUser.posts,
                subscribersCount: ProfileUser.subscribersCount,
                subscriptionsCount: ProfileUser.subscriptionsCount,
                subscribers: ProfileUser.subscribers,
                subscriptions: ProfileUser.subscriptions,
                viewedPosts: ProfileUser.viewedPosts
             });
        await ArchivedProfileUser.save();
        
    
        await User.findByIdAndDelete(userId);
        await ProfileUser.findOneAndDelete({ user: userId });

        res.status(200).json({ message: 'Compte utilisateur supprimer avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur lors de la suppression du compte utilisateur' });
    }
});

module.exports = router;
 
 
 
 
 
 
 
 
 

