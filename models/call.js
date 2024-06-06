//call.js
const mongoose = require('mongoose');

const callSchema = new mongoose.Schema({
    callerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    type: { type: String, enum: ['audio', 'video'], required: true },
    status: { type: String, enum: ['initiated', 'ended'], default: 'initiated' },
    timestamp: { type: Date, default: Date.now }, 
    callerUsername: {
        type: String,
        required: true
    },
    receiverUsername: {
        type: String,
        required: true
    },
    Type: {
        type : String, ref : 'User'
    }
});

const Call = mongoose.model('Call', callSchema);

module.exports = Call;