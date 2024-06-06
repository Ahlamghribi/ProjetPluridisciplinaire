const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const searchSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  keyword: String, //mot cle li drna search elih (username or bio)
  type: { type: String, enum: ['user', 'post'] }, // type de recherche 
  createdAt: { type: Date, default: Date.now } //la date de la recherche
});

module.exports = mongoose.model('Search', searchSchema);
