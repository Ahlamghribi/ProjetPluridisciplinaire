const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const archivedprofiluserschema = new mongoose.Schema({
    user: { type: String, ref: 'User', required: true },
    profilePhoto: { type: String },
    bio: { type: String },
    role: { type: String, enum: ['etudiant', 'professeur'], default: 'etudiant', required: true },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], // Reference to the posts by the user
    subscribersCount: { type: Number, default: 0 ,ref: 'User'},
    subscriptionsCount: { type: Number, default: 0 ,ref: 'User'},
    subscribers: [{ type: String, ref: 'User' }],
    subscriptions: [{ type: String, ref: 'User' }],
    viewedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], // Array of viewed post IDs
      //la date d'archivage
    dateArchivage: {
        type: Date, 
        default: Date.now 
   } 

});
module.exports = mongoose.model('archivedprofiluser', archivedprofiluserschema);