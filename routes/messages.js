const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const Message = require('../models/message');
const Subscription = require('../models/subscription');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const User = require('../models/user');
const mongoose = require('mongoose');
const Group=require('../models/Groupe');
// Déclarer un objet pour suivre les utilisateurs en ligne
const onlineUsers = {};

// Middleware 
app.use((req, res, next) => {
    req.app.io = io;
    next();
}); 

// Gestion ta3 connexions Socket.IO
// io.on('connection', async (socket) => {
//     console.log('Client connected');

//     // Récupérer du nom de username m socket
//     const username = socket.handshake.query.username;

//     // Mettez à jour la structure de données des utilisateurs en ligne
//     onlineUsers[username] = { socketId: socket.id, lastPingTime: Date.now() };

//     // Mettez à jour la base de données pour marquer l'utilisateur comme en ligne
//     await updateUserStatus(username, true);

//     // Émettez un événement pour indiquer que l'utilisateur est en ligne
//     io.emit('user online', username);

//     // Mécanisme ping/pong
//     socket.on('pong', () => {
//         // Mettez à jour le temps du dernier ping
//         onlineUsers[username].lastPingTime = Date.now();
//     });
    
// // Fonction pour rechercher des messages côté client
// function searchMessages(keyword) {
//     // Envoyer une demande de recherche de messages au serveur via WebSocket
//     socket.emit('search messages', keyword);
// }

// // Écoute de l'événement de résultats de recherche de messages
// socket.on('search result', (messages) => {
//     // Afficher les messages trouvés dans l'interface utilisateur
//     displaySearchResults(messages);
// });
//     socket.on('disconnect', async () => {
//         console.log('Client disconnected');
//         // Mettez à jour la base de données pour marquer l'utilisateur comme hors ligne
//         await updateUserStatus(username, false);

//         // Émettez un événement pour indiquer que l'utilisateur est hors ligne
//         io.emit('user offline', username);

//         // Supprimez l'utilisateur de la liste des utilisateurs en ligne
//         delete onlineUsers[username];
//     });

//     // Récupération des messages hors ligne pour cet utilisateur
//     const offlineMessages = await Message.find({ receiverUsername: username, messageType: 'offline' });
//     socket.emit('offline messages', offlineMessages);

//     // Écoute de l'événement de message de chat
//     socket.on('chat message', async (message) => {
//         console.log('Received chat message:', message);
//         const newMessage = new Message({ 
//             senderUsername: message.senderUsername, 
//             receiverUsername: message.receiverUsername, 
//             messageType: 'normal', 
//             content: message.content,
//             status: 'sent' // Par défaut, le statut du message est défini sur "sent"
//         });
//         await newMessage.save();

//         if (onlineUsers[message.receiverUsername]) {
//             // Si l'utilisateur est en ligne, mettez à jour le statut du message sur "read"
//             newMessage.status = 'delivered';
//             await newMessage.save();
//         } else {
//             // Si l'utilisateur est hors ligne, le message est "delivered"
//             newMessage.status = 'sent';
//             await newMessage.save();
//         }

//         io.emit('chat message', message);
//     });

//     // Écoute de l'événement de message vu
//     socket.on('message seen', async ({ messageId }) => {
//         try {
//             const message = await Message.findById(messageId);
//             if (!message) {
//                 console.error('Message not found');
//                 return;
//             } 
//             else {
//                 message.status = 'read';
//                  }
//            await message.save();
//             console.log('Message marked as seen');
//         } catch (err) {
//             console.error('Error marking message as seen:', err);
//         }
//     });

//     // Écoute de l'événement de message de fichier
//     socket.on('file message', async (message) => {
//         console.log('Received file message:', message);
//         // Enregistrer le message dans la base de données
//         const newMessage = new Message({ senderUsername: message.senderUsername, receiverUsername: message.receiverUsername, messageType: 'normal', content: message.content });
//         await newMessage.save();
//         // Envoyer le message à tous les clients connectés
//         io.emit('file message', message);
//     });

//     // Gestion des réponses aux invitations
//     socket.on('invitation response', async ({ messageId, response }) => {
//         try {
//             const message = await Message.findById(messageId);
//             if (!message) {
//                 return; // Gérer l'erreur si le message n'est pas trouvé
//             }

//             // Mettre à jour l'état de l'invitation dans la base de données
//             message.status = response;
//             await message.save();

//             // Informer l'expéditeur de l'invitation de la réponse de l'utilisateur
//             socket.broadcast.emit('invitation response', response);
//         } catch (err) {
//             console.error(err);
//         }
//     });
// });

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // save files to the uploads folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // add timestamp to filenames to ensure uniqueness
    }
});
const upload = multer({ storage: storage }); 

// Route for sending a message or invitation
app.post('/send', async (req, res) => {
     const { senderUsername, receiverUsername, messageType, content } = req.body;
    try { 
        // const senderSubscribed = await Subscription.findOne({ subscriber: senderUsername, target: receiverUsername });
        // const receiverSubscribed = await Subscription.findOne({ subscriber: receiverUsername, target: senderUsername });

        // // Détermine le type de message
        // let messageTypeInfo;
        // if (!senderSubscribed && !receiverSubscribed) {
        //     messageTypeInfo = 'invitation';
        // } else {
        //     messageTypeInfo = 'normal';
        // }

        // Crée un nouveau message
        let newMessage;
        // if (messageTypeInfo === 'invitation') {
        //     newMessage = new Message({ senderUsername, receiverUsername, messageprop: 'invitation', content });
        //     await newMessage.save();
        //     req.app.io.emit('invitation', { senderUsername, receiverUsername, content });
        // } else {
        //     newMessage = new Message({ senderUsername, receiverUsername, messageprop: 'normal', content });
        //     await newMessage.save();
        //     req.app.io.emit('chat message', { senderUsername, receiverUsername, content });
        // }
        newMessage = new Message({ senderUsername, receiverUsername, messageprop: 'normal', content });
        await newMessage.save();
        req.app.io.emit('chat message', { senderUsername, receiverUsername, content });

        // Envoie une réponse avec le type de message
        res.status(201).json({ message: 'Message sent successfully', messageprop: newMessage.messageprop });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    } 
});
 
// Route for sending a file message
app.post('/send-file', upload.single('file'), async (req, res) => {
    const { senderUsername, receiverUsername, messageType } = req.body;
    const file = req.file;
    try { 
        const newMessage = new Message({
            senderUsername,
            receiverUsername,
            messageType,
            content: file.path // save the file path as the content of the message
        });
        await newMessage.save();

        req.app.io.emit('file message', { senderUsername, receiverUsername, content: file.path });

        res.status(201).json({ message: 'File sent successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
 
// Route pour manipuler l'état en ligne des utilisateurs
app.post('/online', async (req, res) => {
    const { username, isOnline } = req.body;
    try {
        // Mettre à jour le statut en ligne de l'utilisateur dans la base de données
        await updateUserStatus(username, isOnline);
        res.status(200).json({ message: 'User online status updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
// Route pour récupérer le statut en ligne d'un utilisateur
app.get('/online-status', async (req, res) => {
    const { username} = req.body;
    try {
        // Recherche de l'utilisateur dans la base de données
        const user = await User.findOne({ username: username }); 
        // Renvoyer le statut en ligne de l'utilisateur
        res.json({ username: user.username, isOnline: user.isOnline });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
// Route pour marquer un message comme envoyé
app.put('/mark-as-sent', async (req, res) => {
    const { messageId } = req.params;
    try {
        // Recherche du message dans la base de données
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        // Mettre à jour l'état du message en fonction de la disponibilité de l'utilisateur
        if (!isUserOnline) {
            message.status = 'sent';
        } else {
            message.status = 'delivered';
        }

        await message.save();

        // Répondre avec un message de succès
        res.status(200).json({ message: 'Message marked as sent' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
  // Route pour marquer un message comme lu
app.put('/mark-as-read', async (req, res) => {
    const { content, senderUsername, receiverUsername } = req.body; // Récupérez les informations du message depuis le corps de la requête
    try {
        // Recherche du message dans la base de données en utilisant les informations fournies
        const message = await Message.findOne({ content, senderUsername, receiverUsername });
        
        if (!message) {
            console.error('Message not found');
            return res.status(404).json({ error: 'Message not found' });
        } 
        message.status = 'read';
        await message.save();

         // Répondre avec un message de succès
        res.status(200).json({ message: 'Message marked as read' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
// Route pour supprimer un membre du groupe
app.delete('/groups/:groupId/members/:memberId', async (req, res) => {
    const { groupId, memberId } = req.params;
    try {
        // Trouver le groupe par son ID
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        // Vérifier si l'utilisateur est l'administrateur du groupe (créateur)
        if (group.creator !== req.user.id) {
            return res.status(403).json({ error: 'You are not authorized to perform this action' });
        }

        // Vérifier si le membre à supprimer existe dans le groupe
        if (!group.members.includes(memberId)) {
            return res.status(404).json({ error: 'Member not found in group' });
        }

        // Supprimer le membre du groupe
        group.members = group.members.filter(member => member !== memberId);
        await group.save();

        res.json({ message: 'Member removed from group successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route pour ajouter un membre au groupe
app.post('/groups/:groupId/members', async (req, res) => {
    const { groupId } = req.params;
    const { memberId } = req.body;
    try {
        // Trouver le groupe par son ID
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        // Vérifier si l'utilisateur est l'administrateur du groupe (créateur)
        if (group.creator !== req.user.id) {
            return res.status(403).json({ error: 'You are not authorized to perform this action' });
        }

        // Ajouter le membre au groupe s'il n'est pas déjà membre
        if (!group.members.includes(memberId)) {
            group.members.push(memberId);
            await group.save();
        }

        res.json({ message: 'Member added to group successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route pour renommer le groupe
app.put('/groups/:groupId', async (req, res) => {
    const { groupId } = req.params;
    const { newName } = req.body;
    try {
        // Trouver le groupe par son ID
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        // Vérifier si l'utilisateur est l'administrateur du groupe (créateur)
        if (group.creator !== req.user.id) {
            return res.status(403).json({ error: 'You are not authorized to perform this action' });
        }

        // Renommer le groupe
        group.name = newName;
        await group.save();

        res.json({ message: 'Group name updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route pour créer un groupe de messages
app.post('/groups', async (req, res) => {
    const { name, members, creator } = req.body;
    try {  
        const group = new Group({ name, members, creator });
        await group.save(); 
          
        res.status(201).json(group);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
  
// Route pour rechercher des messages
app.get('/search', async (req, res) => {
    const { keyword } = req.body;

    try {
        // Rechercher 
        const messages = await Message.find({ content: { $regex: keyword, $options: 'i' } });
 
        res.status(200).json({ messages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

//   mettre à jour le statut en ligne de luser dans la bd
async function updateUserStatus(username, isOnline) {
    // Mettez à jour le statut en ligne de l'utilisateur dans la base de données
    await User.updateOne({ username: username }, { isOnline: isOnline });
}


// Route pour supprimer un message
app.delete('/messages/:messageId', async (req, res) => {
    const { messageId } = req.params;
    try {
        // Recherche du message dans la base de données
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        // Suppression du message
        await message.remove();

        res.json({ message: 'Message deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route pour ajouter une réaction à un message
app.post('/messages/:messageId/reactions', async (req, res) => {
    const { messageId } = req.params;
    const { reactionType } = req.body;
    try {
        // Recherche du message dans la base de données
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        // Ajout de la réaction au message
        message.reactions.push({ type: reactionType });
        await message.save();

        res.json({ message: 'Reaction added to message successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
// Route pour supprimer une conversation entre deux utilisateurs
app.delete('/conversations/:senderUsername/:receiverUsername', async (req, res) => {
    const { senderUsername, receiverUsername } = req.params;
    try {
        // Recherche des messages dans la base de données qui correspondent à la conversation entre les deux utilisateurs
        const messages = await Message.find({
            $or: [
                { senderUsername: senderUsername, receiverUsername: receiverUsername },
                { senderUsername: receiverUsername, receiverUsername: senderUsername }
            ]
        });

        // Suppression de tous les messages de la conversation
        await Message.deleteMany({
            $or: [
                { senderUsername: senderUsername, receiverUsername: receiverUsername },
                { senderUsername: receiverUsername, receiverUsername: senderUsername }
            ]
        });

        res.json({ message: 'Conversation deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
// Route pour supprimer un groupe de messages si l'utilisateur est le admin sinon may9derch
app.delete('/groups/:groupId', async (req, res) => {
    const { groupId } = req.params;
    const { userId } = req.body; // Supposons que vous avez un middleware qui extrait l'ID de l'utilisateur de la demande

    try {
        // Recherche du groupe dans la base de données
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        // Vérifie si l'utilisateur est le créateur du groupe
        if (group.creator !== userId) {
            return res.status(403).json({ error: 'You are not authorized to delete this group' });
        }

        // Suppression du groupe
        await Group.findByIdAndDelete(groupId);

        res.json({ message: 'Group deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


// spam
app.put('/messages/spam', async (req, res) => {
    const { messageId } = req.params;
    try {
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }
        message.isSpam = true;
        await message.save();
        res.json({ message: 'Message marked as spam' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route pour marquer un message comme restreint
app.put('/messages/restreint', async (req, res) => {
    const { messageId } = req.params;
    try {
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }
        message.isRestricted = true;
        await message.save();
        res.json({ message: 'Message marked as restricted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
// Route pour bloquer un utilisateur
app.post('/block', async (req, res) => {
    const { username } = req.params;
    const { blockerUsername } = req.body;

    try {
        // Recherche de l'utilisateur bloquant dans la base de données
        const blockerUser = await User.findOne({ username: blockerUsername });
        if (!blockerUser) {
            return res.status(404).json({ error: 'Blocker user not found' });
        }

        // Vérification si l'utilisateur à bloquer existe dans la base de données
        const userToBlock = await User.findOne({ username });
        if (!userToBlock) {
            return res.status(404).json({ error: 'User to block not found' });
        }

        // Vérification si l'utilisateur à bloquer est déjà dans la liste des utilisateurs bloqués
        if (blockerUser.blockedUsers.includes(username)) {
            return res.status(400).json({ error: 'User already blocked' });
        }

        // Mettre à jour le statut de blocage de l'utilisateur bloquant dans la base de données
        blockerUser.blockedUsers.push(username);
        await blockerUser.save();

        res.json({ message: 'User blocked successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});



module.exports = app; 
