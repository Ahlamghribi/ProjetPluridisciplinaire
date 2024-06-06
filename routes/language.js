
const express = require('express');
const router = express.Router();
const Language = require('../models/Language');

// GET all languages
router.get('/languages', async (req, res) => {
    try {
        const languages = await Language.find();
        res.json(languages);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// POST add new language
router.post('/languages', async (req, res) => {
    const { name, code } = req.body;

    try {
const newLanguage = new Language({ name });
await newLanguage.save();
res.json(newLanguage); // Return the newly added language
} catch (err) {
console.error(err);
res.status(500).send('Server Error');
}
});

// DELETE language by ID
router.delete('/languages/:id', async (req, res) => {
const languageId = req.params.id;
try {
    const deletedLanguage = await Language.findByIdAndDelete(languageId);
    if (!deletedLanguage) {
        return res.status(404).json({ errors: [{ msg: 'Language not found' }] });
    }
    res.json({ msg: 'Language deleted successfully', deletedLanguage });
} catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
}
});
module.exports = router;