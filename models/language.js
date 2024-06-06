const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const languageSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // Name of the language
 
});

const Language = mongoose.model('Language', languageSchema);

module.exports = Language;