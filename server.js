const express = require("express");
const cors = require("cors");
const passport = require('./config/passport-config');

// Import all route files
const userRoute = require('./routes/user');
const forgetPasswordRoute = require('./routes/forget-password');
const modificationPasswordRoute = require('./routes/modification/modification-password');
const modificationEmailRoute = require('./routes/modification/modification-email');
const modificationLanguageRoute = require('./routes/modification/modification-language');
const modificationIdentitéRoute = require('./routes/modification/modification-identité');
const modificationDateOfBirthRoute = require('./routes/modification/modification-dateofbirth');
const deleteRoute = require('./routes/deleteacount');
const rechercheuserRoute = require('./routes/recherche-user');
const recherchepostRoute = require('./routes/recherche-posts');
const changerTypeCompteRoute = require('./routes/changerTypeCompte');
const blockageRoute = require('./routes/blockage');
const activityeRoute = require('./routes/activities');
const reactioncommentRoute = require('./routes/reactioncomment');
const reactionpostRoute = require('./routes/reactionpost');
const responsecommentRoute = require('./routes/responsecomment');
const commentRoute = require('./routes/comment');
const adminRoute = require('./routes/admin');
const channelRoute = require('./routes/channel');
const groupeRoute = require('./routes/groupe');
const languageRoute = require('./routes/language');
const postRoute = require('./routes/post');
const profileRoute = require('./routes/profile');
const requestRoute = require('./routes/request');
const serverRoute = require('./routes/server');
const messageRoute = require('./routes/messages');
require('./config/connect');
const Message = require('./models/message');
const User = require('./models/user');



// Initialize express app
const app = express();

const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);

// Configure CORS middleware
app.use(cors({
    origin: '*', // Accept requests from any origin
    methods: ['GET', 'POST', 'PUT'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));

// Initialize Socket.io server with CORS options
const io = new Server(server, {
    cors: {
        origin: '*', // Accept requests from any origin
        methods: ['GET', 'POST', 'PUT']
    }
});

// io.on('connection', (socket) => {
//   console.log('Client connected');
  
//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });
const onlineUsers = {};

io.on('connection', async (socket) => {
    console.log('Client connected');

    // Récupérer du nom de username m socket
    const username = socket.handshake.query.username;

    // Mettez à jour la structure de données des utilisateurs en ligne
    onlineUsers[username] = { socketId: socket.id, lastPingTime: Date.now() };

    // Mettez à jour la base de données pour marquer l'utilisateur comme en ligne
    await updateUserStatus(username, true);

    // Émettez un événement pour indiquer que l'utilisateur est en ligne
    io.emit('user online', username);

    // Mécanisme ping/pong
    socket.on('pong', () => {
        // Mettez à jour le temps du dernier ping
        onlineUsers[username].lastPingTime = Date.now();
    });
    

    socket.on('get user messages', async ({ senderUsername, receiverUsername }) => {
        try {
            // Find messages between the two users
            const messages = await Message.find({
                $or: [
                    { senderUsername: senderUsername, receiverUsername: receiverUsername },
                    { senderUsername: receiverUsername, receiverUsername: senderUsername }
                ]
            }).sort({ createdAt: 1 }); // Sort by creation date

            // Emit the messages back to the client
            socket.emit('user messages', messages);
        } catch (err) {
            console.error('Error retrieving messages:', err);
        }
    });
// Fonction pour rechercher des messages côté client
function searchMessages(keyword) {
    // Envoyer une demande de recherche de messages au serveur via WebSocket
    socket.emit('search messages', keyword);
}

// Écoute de l'événement de résultats de recherche de messages
socket.on('search result', (messages) => {
    // Afficher les messages trouvés dans l'interface utilisateur
    displaySearchResults(messages);
});
    socket.on('disconnect', async () => {
        console.log('Client disconnected');
        // Mettez à jour la base de données pour marquer l'utilisateur comme hors ligne
        await updateUserStatus(username, false);

        // Émettez un événement pour indiquer que l'utilisateur est hors ligne
        io.emit('user offline', username);

        // Supprimez l'utilisateur de la liste des utilisateurs en ligne
        delete onlineUsers[username];
    });

    // Récupération des messages hors ligne pour cet utilisateur
    const offlineMessages = await Message.find({ receiverUsername: username, messageType: 'offline' });
    socket.emit('offline messages', offlineMessages);

    // Écoute de l'événement de message de chat
    socket.on('chat message', async (message) => {
        console.log('Received chat message:', message);
        const newMessage = new Message({ 
            senderUsername: message.senderUsername, 
            receiverUsername: message.receiverUsername, 
            messageprop: 'normal', 
            content: message.content,
            status: 'sent' // Par défaut, le statut du message est défini sur "sent"
        });
        await newMessage.save();

        if (onlineUsers[message.receiverUsername]) {
            // Si l'utilisateur est en ligne, mettez à jour le statut du message sur "read"
            newMessage.status = 'delivered';
            await newMessage.save();
        } else {
            // Si l'utilisateur est hors ligne, le message est "delivered"
            newMessage.status = 'sent';
            await newMessage.save();
        }

        io.emit('chat message', message);
    });

    // Écoute de l'événement de message vu
    socket.on('message seen', async ({ messageId }) => {
        try {
            const message = await Message.findById(messageId);
            if (!message) {
                console.error('Message not found');
                return;
            } 
            else {
                message.status = 'read';
                 }
           await message.save();
            console.log('Message marked as seen');
        } catch (err) {
            console.error('Error marking message as seen:', err);
        }
    });

    // Écoute de l'événement de message de fichier
    socket.on('file message', async (message) => {
        console.log('Received file message:', message);
        // Enregistrer le message dans la base de données
        const newMessage = new Message({ senderUsername: message.senderUsername, receiverUsername: message.receiverUsername, messageType: 'normal', content: message.content });
        await newMessage.save();
        // Envoyer le message à tous les clients connectés
        io.emit('file message', message);
    });

    // Gestion des réponses aux invitations
    socket.on('invitation response', async ({ messageId, response }) => {
        try {
            const message = await Message.findById(messageId);
            if (!message) {
                return; // Gérer l'erreur si le message n'est pas trouvé
            }

            // Mettre à jour l'état de l'invitation dans la base de données
            message.status = response;
            await message.save();

            // Informer l'expéditeur de l'invitation de la réponse de l'utilisateur
            socket.broadcast.emit('invitation response', response);
        } catch (err) {
            console.error(err);
        }
    });
});
async function updateUserStatus(username, isOnline) {
    // Mettez à jour le statut en ligne de l'utilisateur dans la base de données
    await User.updateOne({ username: username }, { isOnline: isOnline });
}

// Use JSON as body format for all requests
app.use(express.json());

// Initialize Passport middleware
app.use(passport.initialize());

// Use routes
app.use('/user', userRoute);
app.use('/forgetPassword', forgetPasswordRoute);
app.use('/modificationPassword', modificationPasswordRoute);
app.use('/modificationEmail', modificationEmailRoute);
app.use('/modificationLanguage', modificationLanguageRoute);
app.use('/modificationidentite', modificationIdentitéRoute);
app.use('/modificationdateofbirth', modificationDateOfBirthRoute);
app.use('/deleteacount', deleteRoute);
app.use('/rechercheuser', rechercheuserRoute);
app.use('/recherchepost', recherchepostRoute);
app.use('/changeTypeCompte', changerTypeCompteRoute);
app.use('/blockage', blockageRoute);
app.use('/activity', activityeRoute);
app.use('/reactioncomment', reactioncommentRoute);
app.use('/reactionpost', reactionpostRoute);
app.use('/responsecomment', responsecommentRoute);
app.use('/comment', commentRoute);
app.use('/admin', adminRoute);
app.use('/channel', channelRoute);
app.use('/groupe', groupeRoute);
app.use('/language', languageRoute);
app.use('/post', postRoute);
app.use('/profile', profileRoute);
app.use('/request', requestRoute);
app.use('/server', serverRoute);
app.use('/message', messageRoute);

// Listen to the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
