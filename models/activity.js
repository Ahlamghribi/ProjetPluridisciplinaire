const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['comment', 'like', 'partage'] }, // Type d'activité 
  postId: { type: Schema.Types.ObjectId, ref: 'Post' }, // ID du post associé
  commentId: { type: Schema.Types.ObjectId, ref: 'Comment' }, // ID du commentaire associé 
  createdAt: { type: Date, default: Date.now }// la date de chaque activity 
});

module.exports = mongoose.model('Activity', activitySchema);
