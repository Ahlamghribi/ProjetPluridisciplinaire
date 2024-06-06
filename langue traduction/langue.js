const express = require('express');
const i18n = require('i18n');
const app = express();
const mongoose = require('mongoose');
const fs = require('fs');
const csvParser = require('csv-parser');

// Configuration de i18n
i18n.configure({
    locales: ['en', 'fr', 'ar'], // Langues prises en charge
    directory: __dirname + '/locales', // Répertoire contenant les fichiers de traduction
    defaultLocale: 'en', // Langue par défaut
    cookie: 'lang', // Nom du cookie pour stocker la langue préférée du client
});

 const languageSchema = new mongoose.Schema({
    name: {
        en: { type: String, required: true },
        fr: { type: String, required: true },
        ar: { type: String, required: true },
    },
});

const Traduction = mongoose.model('Traduction', languageSchema);

// Middleware pour l'initialisation de i18n
app.use(i18n.init);
app.use(express.json());


app.get('/translate', async (req, res) => {
    const { lang, word } = req.body;

    console.log('Langue spécifiée :', lang);
    console.log('Mot spécifié :', word);
let translatedWord;
     const translatedWordEN = await Traduction.findOne({ 'name.en': word }).select(`name.${lang}`);
// Recherche dans la langue française
const translatedWordFR = await Traduction.findOne({ 'name.fr': word }).select(`name.${lang}`);
// Recherche dans la langue arabe
const translatedWordAR = await Traduction.findOne({ 'name.ar': word }).select(`name.${lang}`);
  // Recherche dans la langue anglaise
 console.log("Traduction anglaise :", translatedWordEN);

// Recherche dans la langue française
 console.log("Traduction française :", translatedWordFR);

// Recherche dans la langue arabe
 console.log("Traduction arabe :", translatedWordAR);
 
// Vérifie s 

if (translatedWordEN) {
    translatedWord = translatedWordEN;
} else if (translatedWordFR) {
    translatedWord = translatedWordFR;
} else if (translatedWordAR) {
    translatedWord = translatedWordAR;
}

console.log("Mot traduit final :", translatedWord);

if (!translatedWord) {
    res.status(404).send('Translation not available for the specified word');
    return;
}

// Accédez à la traduction dans la langue spécifiée
const translation = translatedWord.name[lang];
console.log("Traduction finale :", translation);

if (!translation) {
    res.status(404).send('Translation not available for the specified language');
    return;
}

res.send(translation);


});

 app.get('/lang',async (req, res) => {
    const lang = req.params.lang;
    res.cookie('lang', lang); // Stocker la langue dans un cookie
    res.redirect('back'); // Rediriger vers la page précédente
});

// Lecture du fichier CSV et enregistrement des traductions dans la base de données
fs.createReadStream('translations.csv')
    .pipe(csvParser())
    .on('data', async (row) => {
        try {
            const traduction = new Traduction({
                name: {
                    en: row.traduction_en,
                    fr: row.traduction_fr,
                    ar: row.traduction_ar
                }
            });
            await traduction.save();
        } catch (error) {
            console.error('Error saving translation:', error);
        }
    })
    .on('end', () => {
        console.log('Translations saved to database');
    });
 

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

mongoose.connect('mongodb://localhost:27017/socialmedia', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});
