const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const userSchema = new Schema({
    nom: { type: String, required: true }, //required true cad lazem diro 
    prenom: { type: String, required: true },
    username:{ type: String, required: true, unique: true }, //ykon unique 
    dateDeNaissance: { type: Date, required: true },
    sex: { type: String, enum: ['homme', 'femme'], required: true },
    email: { type: String, required: true, unique: true },
    motDePasse: { type: String, required: true },
    role : { type: String,enum:['professeur','etudiant'], required: true },
    language: { type: mongoose.Schema.Types.ObjectId, ref: 'Language' }, // Reference to Language model
    isOnline:{type: String , enum:['online' , 'offline']},
    resetPasswordCode: {//pour stocker le code de confirmation de reinitialisation de mdp
        type: String, 
        default: null // car mchi lazem ndkhloh a chaque fois ykon user jdid hadk par defaut ykon null brk ida kan forgetpassword ndiro apdate 
    },
    resetPasswordExpires: {//pour stocker sa date 
        type: Date,
        default: null
    },
    deviceToTry: {
        ipAddress: String,
        userAgent: String
      }, 
    devices: [{ ipAddress: String, userAgent: String }] // Assurez-vous que devices est défini dans le schéma
    ,
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
    searchHistory: [{ type: Schema.Types.ObjectId, ref: 'Search' }] //reference a model search 
})
module.exports = mongoose.model('User', userSchema);



