const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

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

const users = new Users();

// Register a connection event listener
io.on('connection', (socket) => {
    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            // Stop code if invalid
            return callback('Name and room name are required.');
        }

        // Join by same room name
        socket.join(params.room);

        // first remove user from previous room, then add to new room
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        // update user list
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        // io.emit -> io.to('fight club').emit
        // socket.broadcast.emit -> socket.broadcast.to('fight club').emit
        // socket.emit

        socket.emit('newMessage', generateMessage('God King Odin', 'You have chosen worthy to be of my chat room. Speak amongst yourselves!'));

        socket.broadcast.to(params.room).emit('newMessage', generateMessage('God King Odin', `${params.name} has joined the room.`));

        callback();
    });

    socket.on('createMessage', (msg, callback) => {
        const user = users.getUser(socket.id);

        // cannot spam empty message
        if (user && isRealString(msg.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, msg.text));
        }

        callback(); /* acknowledgment on listener and return to emitter */
    });

    socket.on('createLocationMessage', (coords) => {
        const user = users.getUser(socket.id);

        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });

    socket.on('disconnect', () => {
        const user = users.removeUser(socket.id);

        // if a user was removed
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('God King Odin', `${user.name} has left.`))
        }
    });
});

server.listen(port, () => {
    console.log(`Server established on *:${port}`);
});
