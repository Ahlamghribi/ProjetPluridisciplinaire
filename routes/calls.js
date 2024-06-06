const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const { RTCPeerConnection, RTCSessionDescription } = require('wrtc');
const Call = require('../models/call');
const app = express();
const server = http.createServer(app);

// Initialize socket.io
const io = socketIo(server);

// Serve static files for the user interface
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Initialize Socket.IO for signaling
io.on('connection', (socket) => {
    console.log('New user connected');

    // Handle 'call' event to initiate a call
    socket.on('call', async (data) => {
        const { callerId, receiverId } = data;
        try {
            // Create a new call instance
            const newCall = new Call({ callerId, receiverId, status: 'ongoing' });
            await newCall.save();

            // Emit call initiation event to the receiver
            io.to(receiverId).emit('callInitiated', { call: newCall });
        } catch (err) {
            console.error(err);
        }
    });

    // Handle 'answer' event to accept a call
    socket.on('answer', async (data) => {
        const { callId } = data;
        try {
            const call = await Call.findByIdAndUpdate(callId, { status: 'accepted' }, { new: true });

            // Emit call accepted event to the caller
            io.to(call.callerId).emit('callAccepted', { call });
        } catch (err) {
            console.error(err);
        }
    });

    // Handle 'endCall' event to end a call
    socket.on('endCall', async (data) => {
        const { callId } = data;
        try {
            const call = await Call.findByIdAndUpdate(callId, { status: 'ended' }, { new: true });

            // Emit call end event to both caller and receiver
            io.to(call.callerId).emit('callEnded', { call });
            io.to(call.receiverId).emit('callEnded', { call });
        } catch (err) {
            console.error(err);
        }
    });

    // Handle 'disconnect' event
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Create a Peer-to-Peer connection
function createPeerConnection(from, to) {
    const peerConnection = new RTCPeerConnection();

    // Handle receiving video
    peerConnection.ontrack = (event) => {
        const stream = event.streams[0];
        // Update UI to display live video
        io.to(to).emit('stream', { from, to, stream });
    };

    // Add the connection to the user's connections list
    if (!users[from]) {
        users[from] = { peerConnections: {} };
    }
    users[from].peerConnections[to] = peerConnection;

    return peerConnection;
}

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// Route for ending a call
app.post('/end', async (req, res) => {
    const callId = req.body.callId;

    try {
        // Find the call by ID
        const call = await Call.findById(callId);

        // Check if the call exists
        if (!call) {
            return res.status(404).json({ error: 'Call not found' });
        }

        // Stop the timer
        clearInterval(call.timer);

        // Calculate the duration
        const endTime = Date.now();
        const duration = endTime - call.startTime;

        // Update the call with status, end time, and duration
        call.status = 'ended';
        call.endTime = endTime;
        call.duration = duration;
        await call.save();

        // Emit call end event to both caller and receiver
        io.to(call.callerUsername).emit('callEnded', { call });
        io.to(call.receiverUsername).emit('callEnded', { call });

        // Send response
        res.status(200).json({ message: 'Call ended successfully', call });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


// Middleware to pass io instance to routes
app.use((req, res, next) => {
    req.app.io = io;
    next();
});// Route for accepting a call
// Route for initiating or accepting a call
app.post('/accept', async (req, res) => {
    const { callerUsername, receiverUsername, type, callId } = req.body;
    let endTime; // Declare endTime variable

    try {
          
            const startTime = Date.now(); // Get the current time
            const newCall = new Call({ callerUsername, receiverUsername, type, startTime });
            await newCall.save();

            // Emit call initiation event to the receiver
            io.to(receiverUsername).emit('callInitiated', { call: newCall });

            // Respond with the newly created call object and start message
            res.status(201).json({ successMessage: 'Call accepted' , call: newCall});

          
             newCall.timer = setInterval(async () => {
                const duration = endTime - startTime;  
                await Call.findByIdAndUpdate(newCall._id, { duration });  
            });  
        
        }
     catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});



// Route for rejecting a call
app.post('/reject', async (req, res) => {
    const { callId, callerUsername, receiverUsername, type } = req.body;

    try {
        // Find the call by its ID
        const call = await Call.findById(callId); 

        // Save the rejected call details in the database
        const rejectedCall = new Call({
            callerUsername: callerUsername,
            receiverUsername: receiverUsername,
            callerId: call.callerId,
            receiverId: call.receiverId,
            type: type,
            rejectedAt: new Date(),
            Type : 'Rejected' // Enregistrer la date de rejet de l'appel
        });
        await rejectedCall.save();

        // Respond with success message
        res.json({ message: 'Call rejected.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
 
module.exports = app; 
