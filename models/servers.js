const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const serverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  channels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'channel' }] ,
});

module.exports = mongoose.model('server', serverSchema);