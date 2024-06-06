 //import to mongoose
 
 const mongoose = require('mongoose')
 //connection with database
 mongoose.connect('mongodb://localhost:27017/test')
 //si connect affiche connected si ya une erreur affiche erreur bch n3rf brk man cmd y'affichili n3rf ida tconicta ou nn
 .then(
    ()=>{
        console.log("connected");
    }
 )
 .catch(
    (erreur)=>{
        console.log("erreur");
    }
 )
 //bch n9der nacceder l had le file b kaml les autres server (file)
 module.exports = mongoose;



