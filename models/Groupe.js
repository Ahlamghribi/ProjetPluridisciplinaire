const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const groupeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  creator: { type: String, ref: 'User', required: true },
  members: [{ type: String, ref: 'User' }],
});

module.exports = mongoose.model('Groupe', groupeSchema);