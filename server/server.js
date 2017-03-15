const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
// Creating a new instance of http.Server
// app to be a function handler that can supply to an HTTP server
const server = http.createServer(app);

// Socket.IO is composed of two parts:
// 1. A server that integrates with the Node HTTP Server: socket.io 
// 2. A client library that loads on the browser side: socket.io-client (ex. in index.html)

// Use io to communicate between server and client
const io = socketIO(server);

app.use(express.static(publicPath));

// Register a connection event listener
io.on('connection', (socket) => {
    console.log('New user connected.');

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined.'));

    socket.on('createMessage', (msg, callback) => {
        console.log('createMessage', msg);
        io.emit('newMessage', generateMessage(msg.from, msg.text));
        callback('To client: hey'); /* acknowledgment on listener and return to emitter */
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', () => {
        console.log('User disconnected from server.');
    });
});

server.listen(port, () => {
    console.log(`Server established on *:${port}`);
});
