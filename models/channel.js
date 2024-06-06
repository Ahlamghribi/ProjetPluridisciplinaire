const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const channelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  server: { type: mongoose.Schema.Types.ObjectId, ref: 'Servers', required: true },
});

module.exports = mongoose.model('channel', channelSchema);