const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderUsername: {
        type: String,
        required: true
    },
    receiverUsername: {
        type: String,
        required: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'video', 'audio', 'file']
    }, 
    messageprop : {
        type : String,
        enum :['invitation','normal'],
        required : true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['not sent', 'sent', 'delivered', 'read'], // Ajoutez tous les états possibles
        default: 'sent'
    },
    isSpam: { 
        type: Boolean, 
        default: false 
    },
    isRestricted: { 
        type: Boolean, 
        default: false 
    },
    isBlocked: { 
        type: Boolean, 
        default: false 
    }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
