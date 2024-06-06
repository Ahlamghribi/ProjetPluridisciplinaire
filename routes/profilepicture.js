const express = require('express');
const OneSignal = require('onesignal-node');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/user'); // Assurez-vous que le chemin vers votre modèle User est correct
const multer = require('multer');
const path = require('path');
const Jimp = require('jimp');
const formidable = require('formidable');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
 
// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/socialmedia', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    throw err; // Rejeter l'erreur pour une gestion supplémentaire
  });
  
// Définir le dossier de destination pour les images de profil
const uploadDir = path.join(__dirname, '../uploads');

// Configurer Multer pour gérer le téléchargement de fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Utiliser un nom de fichier unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtrer les fichiers acceptés
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées.'));
  }
};

// Configurer l'upload avec Multer
const upload = multer({ storage: storage, fileFilter: fileFilter });
app.post('/profileee', upload.single('profilePhoto'), async (req, res) => {
  try {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, file) => {
      if (err) {
        console.error('Erreur lors de l\'analyse du formulaire :', err);
        return res.status(500).json({ message: 'Erreur lors de l\'analyse du formulaire.' });
      }

      const username = fields.text1; // Récupération du nom d'utilisateur depuis les champs du formulaire
 
      const user = await User.findOne(username );
      console.log(user);

      if (!user) {
        return res.status(401).json({ message: 'Utilisateur non authentifié.' });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier téléchargé.' });
      }

      let profileText = '';
      if (fields.text2) { // Utiliser 'fields' au lieu de 'req' pour accéder aux données de formulaire
        profileText = fields.text2;
      }

      const image = await Jimp.read(req.file.path);

      const newImagePath = req.file.path.replace('profilePhoto', 'profilePhotoEdited');
      await image.writeAsync(newImagePath);

      // Mettre à jour le chemin de l'image de profil dans la base de données
      const profileUser = await User.findByIdAndUpdate(user._id, { profilePhoto: newImagePath, profileText: profileText }, { new: true });

      res.status(200).json({ message: 'Photo de profil mise à jour avec succès.', profileUser });
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la photo de profil :', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la photo de profil.' });
  }
});

module.exports = app;
