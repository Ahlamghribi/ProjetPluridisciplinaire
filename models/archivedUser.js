const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const archivedUserSchema = new Schema({
    nom: { type: String, required: true }, //required true cad lazem diro 
    prenom: { type: String, required: true },
    username:{ type: String, required: true, unique: true }, //ykon unique 
    dateDeNaissance: { type: Date, required: true },
    sex: { type: String, enum: ['M', 'F'], required: true },
    email: { type: String, required: true, unique: true },
    motDePasse: { type: String, required: true },
    role : { type: String,enum:['professeur','etudiant'], required: true },
    language: { type: mongoose.Schema.Types.ObjectId, ref: 'Language', required: true }, // Reference to Language model
    resetPasswordCode: {//pour stocker le code de confirmation de reinitialisation de mdp
        type: String, 
        default: null // car mchi lazem ndkhloh a chaque fois ykon user jdid hadk par defaut ykon null brk ida kan forgetpassword ndiro apdate 
    },
    resetPasswordExpires: {//pour stocker sa date 
        type: Date,
        default: null
    },
    subscribersCount: { type: Number, default: 0 }, //nb des abonnés
    subscriptionsCount: { type: Number, default: 0 },
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], //tab des abonnés 
    subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    privacy: {
        type: String,
        enum: ['public', 'private'],
        default: 'private'
    },
    blockedUsers: [{ //tab de liste des compte blocker  (par defaut liste vide )
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    searchHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Search' }], //reference a model search 
    //la date d'archivage
    dateArchivage: {
        type: Date, 
        default: Date.now 
    }
});

const ArchivedUser = mongoose.model('ArchivedUser', archivedUserSchema);

module.exports = ArchivedUser;


