//export express 
const express = require('express')
 // creation rout;e c une fct dans app dans express y3ni dji app dakhlha kayn plusieurs app whdkhrin comme router 
 const router = express.Router();
 //import lal file model user bch y9dr y'accedilo (car needs resetpasswordcode et resetpasswordexpires)
const User = require('../models/user');

//import labrary qui responsable d'envoie un email 
const nodemailer = require('nodemailer');
  
const bcrypt = require('bcrypt');

//fct pour generer le code de confirmation  de 6 caractere de type chiffre seulement 
function generateConfirmationCode() {
    const length = 6; // Longueur du code de confirmation
    const chars = '0123456789'; // Caractères autorisés
    let code = '';
    for (let i = 0; i < length; i++) {
        //caractere par caractere  (signification de cette ligne dan le caheir )
        const randomIndex = Math.floor(Math.random() * chars.length);
        code += chars[randomIndex];
    }
    return code;
}

//pour la securité de mon email et l'application on utilider des variable d'environement avec bib dotenv et file .env  
// Importez la bibliothèque dotenv
//require('dotenv').config();

// accéder aux variables d'environnement chargées li rahom f securisé.env 
// via `process.env.VARIABLE_NAME`
/*const gmailUser = process.env.GMAIL_USER;
const gmailPass = process.env.GMAIL_PASS;*/

//fct pour envoie l'email de confirmation 
// Configurer le transporteur SMTP pour l'envoi d'e-mails
//createtransport fct crier objet transporteur bih nb3t les email
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // utilise SSL
    auth: {
        user: 'spprtppsclmd@gmail.com',
        pass: 'p t b i z b j h a f t m l i g u'//apppassword
    }
});


// Fonction pour envoyer le code de confirmation par e-mail
function sendConfirmationCode(email , code) {
    //contenue de courriel
    const mailOptions = { //courriel contenant les info pour envoi le code 
        from: 'spprtppsclmd@gmail.com',
        to: email,
        subject: 'Code de confirmation pour réinitialisation de mot de passe',//le sujet de courriel
        text: `Votre code de confirmation pour réinitialiser votre mot de passe est : ${code}`, //le contenue de corriel est le code de confermation 
    };
     //envoie le corriel
     //fct dans nodemailer qui envoie le courriel prend deux argument mailoption (cintenue de courriel precedent) fct excute juste aprs l'envoie de courriel n3rfo si tb3t ou non 
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {//si le courriel n'evoie pas 
            console.error('Erreur lors de l\'envoi du courriel :', error);
        } else {// si le courriel envoie avec succes 
            console.log('Code de confirmation envoyé :', info.response);
        }
    });
}
  //le code forgetpassword 
  // pour la demande de réinitialisation de mot de passe
router.post('/forget-Password', async (req, res) => {
    // user saisi l'email dans frontend
    const { email } = req.body;
    // Recherche de l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {// si y'a pas ce mail dans bdd
        return res.status(404).send('Utilisateur non trouvé');
    }
    // Génération du code de confirmation aléatoire
    //genere le code avec fct precedent  (le code rah diro hadik fct et nhato dans var confirmationcode)
    const confirmationCode = generateConfirmationCode();
    //stocke le code de confirmation et sa date dans bdd associe avec user 
    user.resetPasswordCode = confirmationCode;
    // had la date hiya date.now hiya date actuelle avec milisecondes plus 30min avec miliseconde cad si user maktbch code de conf pendant 30min man li tab3t hadk le code hna rah yetxpira hadk code 
    user.resetPasswordExpires = Date.now() + (30 * 60 * 1000); // Code expirera dans 30min
    //update pour champs resetpasswordcode et expires alors on enrrgistrer cette update
    await user.save();
    // Envoi du code de confirmation par e-mail avec la dct precedent with nodemailer n3tiha email t3 user li savé dans bdd plus le code de conf 
    sendConfirmationCode(user.email, confirmationCode);
    res.status(200).send('Un code de confirmation a été envoyé');
});

//  la vérification du code de confirmation et la réinitialisation de mot de passe
//probelme dans bdd madirch update lal resetconfirmatoncode 
router.post('/reset-password', async (req, res) => {
    // Dans le corps de la requête ou dans le frontend, l'utilisateur saisit son email, son code de confirmation et son nouveau mot de passe
    const { email, code, newPassword } = req.body;
    
    // Recherche de l'utilisateur par email
    const user = await User.findOne({ email });
    
    // Vérification si l'utilisateur existe et si le code saisi correspond au code de réinitialisation enregistré dans la base de données
    if (!user || user.resetPasswordCode  !== code ||  user.resetPasswordExpires < Date.now()) {
        return res.status(400).send('Code de confirmation invalide ou expiré');
    }
    // Hachage mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Si l'utilisateur et le code sont valides, mettez à jour le mot de passe de l'utilisateur
    user.motDePasse = hashedPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    
    // Enregistrez les modifications dans la base de données
    await user.save();
    
    // Répondez avec un message de succès
    res.status(200).send('Mot de passe réinitialisé avec succès');
});




 //ndir signup jdid 
 //login jdid 
 // apres forgetpassword jdid 












 //export router
 module.exports = router ;