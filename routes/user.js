//export express 
const express = require('express')
 // creation rout;e c une fct dans app dans express y3ni dji app dakhlha kayn plusieurs app whdkhrin comme router 
 const router = express.Router();
 //import lal file user bch y9dr y'accedilo
const User = require('../models/user');

//import labrary pour crypte paasword
const bcrypt = require('bcrypt') ;
//import labrary jsonwebtoken
const jwt = require('jsonwebtoken');

// const Language = require('../models/Language');
const ProfileUser = require('../models/ProfileUser');

require('dotenv').config();
const nodemailer = require('nodemailer');



router.get('/userdata/:username', async (req,res)=>{
  try {
    const username = req.params.username;
    const user = await User.findOne({username}); 
    res.json(user); 
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
})


router.get('/getUserById/:id', async (req,res)=>{
  try {
    const id = req.params.id;
    const user = await User.findById(id); 
    res.json(user); 

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
})


router.get('/verification-email/:email', async (req,res)=>{
  try {
    const email = req.params.email;
    const user = await User.findOne({email}); 
    if(user){
      return res.json(true);
    }
    res.json(false); 
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
})


router.put('/new_password/:email', async (req,res)=>{
  try {
    const email = req.params.email;
    const {newPassword} = req.body;


    const user = await User.findOne({email}); 
    if(user){

      // const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password in the database
      user.motDePasse = bcrypt.hashSync(newPassword, 10);
      const save = await user.save();
      

    return res.status(200).json({ message: 'Password updated successfully' , save: save});
    }

    return res.status(500).send({ message: err.message });

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
})

/*request crud 
//create post request with async await 
//hadi plus utilisable 3la lokhra nkhdem biha  try catch 



router.post('/create', async (req,res)=>{
    try{
        data = req.body;
        usr = new User(data);
        //tedi un peu de temps 3ladik drna await donc lazem nassana chwiya 
        savedUser = await usr.save();
        res.send(savedUser)
        //si il ya une erreur
    }catch(error){
        res.send(error)
    }
})
//get with async wait (plus utilisabe)
router.get('/getit', async (req,res)=>{
    try{
        //tedi un peu de temps 3ladik drna await donc lazem nassana chwiya
        // if i want condition i writhe dakhel find like para condition li habitha 
        //exemple hna age =19 ygetiha 
        users = await User.find({age : 19});
        res.send(users);
        //si il ya une erreur
    }catch(error){
        res.send(error)
    }
})
//get with id request with async wait
router.get('/getallbyid/:id', async (req,res)=>{
    try{
        myid= req.params.id;
        //tedi un peu de temps 3ladik drna await donc lazem nassana chwiya
        // if i want condition i writhe dakhel findone like para condition li habitha 
        //exemple hna id = myid ygetiha 
        users = await User.findOne({_id:myid})
        res.send(users);
        //si il ya une erreur
    }catch(error){
        res.send(error)
    }
})
//delete with async await
router.delete('/deleteasy/:id', async (req,res)=>{
    try{
        myid= req.params.id;
        //tedi un peu de temps 3ladik drna await donc lazem nassana chwiya
        // if i want condition i writhe dakhel findone like para condition li habitha 
        //exemple hna id = myid ygetiha 
        users = await User.findOneAndDelete({_id:myid})
        res.status(200).send(users);
        //si il ya une erreur
    }catch(error){
        res.status(400).send(error)
    }
})
//update with async await 
router.put('/up/:id', async (req,res)=>{
    try{
        myid= req.params.id;
        newdata= req.body;
        //tedi un peu de temps 3ladik drna await donc lazem nassana chwiya
        // if i want condition i writhe dakhel findone like para condition li habitha 
        //exemple hna id = myid ygetiha 
        updated = await User.findByIdAndUpdate({_id:myid} , newdata);
        res.send(updated);
        //si il ya une erreur
    }catch(error){
        res.send(error)
    }
})*/
//post te3 creation de compte sign up 
router.post('/users', [
    // Validation middleware using express-validator
    // ...validation rules...
], async (req, res) => {
    // Check for validation errors
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    // }

    // Destructure user data from request body
    const { language, nom, prenom, dateDeNaissance, sex, username, email, motDePasse, role } = req.body;

    try {
        // Check if the selected language exists
        // const language = await Language.findById(language);
        // if (!language) {
        //     return res.status(400).json({ errors: [{ msg: 'Invalid language selection' }] });
        // }

        // Hash the password
        const hashedPassword = await bcrypt.hash(motDePasse, 10);
   
        // Create a new User instance
        const newUser = new User({
            // language: language._id,
            nom,
            prenom,
            dateDeNaissance,
            sex,
            username,
            email,
            motDePasse: hashedPassword,
            role,
            subscribersCount: 0, // Initialize subscribers count to 0
            subscriptionsCount: 0, // Initialize subscriptions count to 0
            subscribers: [], // Initialize subscribers array to empty
            subscriptions: [], // Initialize subscriptions array to empty
        });

        // Save the user to the database
        await newUser.save();

        // Create a new ProfileUser instance
        const newProfileUser = new ProfileUser({
            user: newUser.username,
            role: newUser.role,
            bio: '', // Default bio
            profilePhoto: 'default.jpg', // Default profile photo
            posts: [], // Initialize posts array to empty
            subscribersCount: newUser.subscribersCount,
            subscriptionsCount: newUser.subscriptionsCount,
            subscribers: newUser.subscribers,
            subscriptions: newUser.subscriptions,
        });

        await ProfileUser.findOneAndUpdate(
            { user: newUser._id },
            {
                $set: {
                    subscribersCount: newUser.subscribersCount,
                    subscriptionsCount: newUser.subscriptionsCount,
                    subscribers: newUser.subscribers,
                    subscriptions: newUser.subscriptions,
                }
            }
        );
        // Save the profile user to the database
        await newProfileUser.save();

        // Send success response
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.post('/sendMail', [
  
], async (req, res) => {
  
  const { email , otp } = req.body;

  try {
    
    emailSend(email , otp);
      
      res.status(201).json({ msg: 'mail sended succsessfully' });
  } catch (err) {
      console.error('Error sending mail:', err);
      res.status(500).json({ msg: 'Server error' });
  }
});

/*
const { body, validationResult } = require('express-validator');

router.post("/register", [
    // Valider les données d'entrée
    body('email').isEmail(),
    body('motDePasse').isLength({ min: 6 })
], async (req, res) => {
    try {
        // Vérifier les erreurs de validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
          
        // Récupérer les données de la requête
        const userData = req.body;
  
        // Hacher le mot de passe avant de l'enregistrer dans la base de données
        const hashedPassword = await bcrypt.hash(userData.motDePasse, 10);  

        // Ajouter le mot de passe haché aux données de l'utilisateur
        userData.motDePasse = hashedPassword;

        // Créer une nouvelle instance utilisateur
        const newUser = new User(userData);

        // Sauvegarder l'utilisateur dans la base de données
        const savedUser = await newUser.save();

        // Renvoyer la réponse avec l'utilisateur enregistré
        res.status(200).json(savedUser);
    } catch (err) {
        // Gérer les erreurs
        console.error(err);
        res.status(500).send('Erreur interne du serveur');
    }
});

*/



//login avec la vérification d'une nouvelle appareil connectée 

async function emailSend(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Nouveau périphérique détecté - Veuillez vérifier votre identité',
      html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .logo {
              width: 100px;
              height: auto;
            }
            .content {
              margin-bottom: 20px;
            }
            .otp-code {
              font-size: 24px;
              font-weight: bold;
              color: #007bff;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="cid:images.png" alt="Image 1">
              <h2>Nouveau périphérique détecté - Vérifiez votre identité</h2>
            </div>
            <div class="content">
              <p>Bonjour,</p>
              <p>Vous avez tenté de vous connecter à votre compte depuis un nouveau périphérique. Pour sécuriser votre compte, veuillez utiliser le code OTP suivant :</p>
              <p class="otp-code">${otp}</p>
              <p>Merci de votre confiance.</p>
            </div>
          </div>
        </body>
      </html>
    //`
    });
    console.log('E-mail envoyé:', info);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
    throw error;
  }
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}







/*
router.post('/login', async (req, res) => {
    try {
       
        const { email, motDePasse,username, ip_address, user_agent } = req.body;
        
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).send('Email ou mot de passe invalide !');
        }
        //pour donner les valeur des mot de passe pour confirmer si i ya une erreur 
        console.log("Mot de passe saisi :", motDePasse);
        console.log("Mot de passe stocké :", user.motDePasse);

        // Vérifier si le mot de passe est correct en comparant avec celui stocké dans la base de données (j'utilise let car isvalidpass peut changer false or true )
        const isValidPassword = bcrypt.compareSync(motDePasse, user.motDePasse);

        if (!isValidPassword ) {
         //t9ol si false ou tru dans cmd pour confirmer brk 
            console.log(isValidPassword);
            return res.status(401).send('Email ou mot de passe invalide !!');
            
        }

        // Si le mot de passe est correct, générer un jeton JWT (pour l'authentification de l'utilisateur pour la securisé)
        const payload = {
            _id: user._id,
            email: user.email,
            nom: user.nom,
            prenom: user.prenom,
        };
        const token = jwt.sign(payload, "1234567", { expiresIn: '1h' }); //1234567 cle secrete 
        console.log(isValidPassword);
        // Renvoyer le jeton JWT en réponse
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur interne du serveur');
    }
});


*/
// confirmation login avec la sécurité : nouvelle appareil connectée 
// router.post('/login', async (req, res) => {
//   try {
//     const { ip_address, user_agent } = req.headers;
//     const { motDePasse, emailOrUserName} = req.body;

//     const user = await User.findOne({ emailOrUserName });

//     if (!user) {
//       return res.status(404).send('Invalid username or password');
//     }

//     const isValidPassword = bcrypt.compareSync(motDePasse, user.motDePasse);

//     if (!isValidPassword) {
//       return res.status(401).send('Invalid username or password');
//     }


//     await user.save();
//     res.status(201).json({ msg: 'User loged in successfully' });

//     // const deviceToTry = {
//     //   ipAddress: ip_address,
//     //   userAgent: user_agent
//     // };

//     // const existingDevice = user.devices.find(device =>
//     //   device.ipAddress === deviceToTry.ipAddress &&
//     //   device.userAgent === deviceToTry.userAgent
//     // );

//     // if (!existingDevice) {
//     //   const otpGenerated = generateOTP();

//     //   await emailSend(email, otpGenerated);

//     //   user.otp = otpGenerated;
//     //   user.deviceToTry = deviceToTry;
//     //   await user.save();

//     //   return res.send('Un code a été envoyé par e-mail, veuillez vérifier votre boîte de réception.');
//     // }

//     // const payload = {
//     //   _id: user._id,
//     //   email: user.email,
//     //   nom: user.nom,
//     //   prenom: user.prenom
//     // };

//     // const token = jwt.sign(payload, "1234567", { expiresIn: '1h' });

//     // res.status(200).json({ token });
//   } catch (error) {
//     console.error('Erreur lors de la connexion :', error);
//     res.status(500).send('Erreur interne du serveur');
//   }
// });

// router.post('/otp', async (req, res) => {
//   try {
//     const { username, otp } = req.body;
//     const user = await User.findOne({ username });

//     console.log('Code OTP envoyé par l\'utilisateur :', otp);
//     console.log('Le Code OTP envoyé à l\'utilisateur :', user.otp);

     
//      if (otp != user.otp) { 
    
//     return res.status(401).send('Code OTP incorrect !');
//     }

//     user.devices.push({ ipAddress: user.deviceToTry.ipAddress, userAgent: user.deviceToTry.userAgent });
//     await user.save();

//     return res.send('Connecté avec succès ! Bienvenue.');
//   } catch (err) {
//     console.error('Erreur lors de la vérification du code OTP :', err);
//     res.status(500).send('Erreur lors de la vérification du code OTP.');
//   }
// });

router.post('/login', async (req, res) => {
  try {
    const { 'x-forwarded-for': ip_address, 'user-agent': user_agent } = req.headers;
    const { motDePasse, emailOrUserName } = req.body;

    // Find user by email or username
    const user = await User.findOne({ 
      $or: [ { email: emailOrUserName }, { username: emailOrUserName } ]
    });

    if (!user) {
      return res.status(404).json({ msg: 'Invalid username or password' });
    }

    const isValidPassword = bcrypt.compareSync(motDePasse, user.motDePasse);

    if (!isValidPassword) {
      return res.status(401).json({ msg: 'Invalid username or password' });
    }

    // User logged in successfully
    
    // Uncomment this section if you want to handle devices and OTP
    // const deviceToTry = {
    //   ipAddress: ip_address,
    //   userAgent: user_agent
    // };

    // const existingDevice = user.devices.find(device =>
      //   device.ipAddress === deviceToTry.ipAddress &&
    //   device.userAgent === deviceToTry.userAgent
    // );

    // if (!existingDevice) {
    //   const otpGenerated = generateOTP();
    //   await emailSend(user.email, otpGenerated);
    //   user.otp = otpGenerated;
    //   user.deviceToTry = deviceToTry;
    //   await user.save();
    //   return res.send('An OTP has been sent to your email. Please check your inbox.');
    // }

    // Create and send JWT token
    // const payload = {
      //   _id: user._id,
    //   email: user.email,
    //   nom: user.nom,
    //   prenom: user.prenom
    // };

    // const token = jwt.sign(payload, "1234567", { expiresIn: '1h' });
    // res.status(200).json({ token });
    
    res.status(200).json({ msg: 'User logged in successfully' , username : user.username , email:user.email});
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});
 






/* autre methode juste aussi 
router.post('/login', async (req,res)=>{
    //read data
      data = req.body;
   // verifier email with findone 
   user = await User.findOne({email : data.email}) //yhaws 3la email li dkhlto f frotend 
   // conditon if l9ito or no 
   if (!user){
    //si mal9inach email li dkhlo user nrdj3lo with res hadk message with status 404 not found 
    res.status(404).send('email or password invalide !')
   }else{//if l9inah  test the password utilise labrary bcrypt.comaparesync n3tiha para password t3 data li raho f bdd et password t3 user li dkhlo f front  return trus or false  
          validPass = bcrypt.compareSync(data.motDePasse , user.motDePasse)
       if(validPass){ //if passwors shih create token
        //install labrary jsonwebtoken
        // import labrary
        //had payload hiya para f jwt.sign t3 li ncriyi biha token car token rah ydi les info t3 user y9olk ida hada howa compte t3k kima f insta ett apres ida shih t9ol beli t3k b front cbn yroh lal page li moraha 
        // et hadk numero li f para t3 sign howa keysecrete li bih rah n3rf ida token shih or no f frontend 
        payload = {
           _id : user._id,
           email : user.email,
           nom : user.nom ,
           prenom :  user.prenom,
          
        }
        token = jwt.sign(payload , '1234567')
        //nb3t response lal front et htha f mytoken bch tkon organise 
        res.status(200).send({mytoken : token})
      }else{ //If false return message dans front
        res.status(401).send('email or password  !')
       }
   } 

})*/


 //export router
 module.exports = router ;
