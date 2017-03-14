const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
// Creating a new instance of http.Server
const server = http.createServer(app);
// Use io to communicate between server and client
const io = socketIO(server);

app.use(express.static(publicPath));

// Register a connection event listener
io.on('connection', (socket) => {
    console.log('New user connected.');

    socket.on('disconnect', () => {
        console.log('User disconnected from server.');
    });
});

server.listen(port, () => {
    console.log(`Server established on ${port}`);
});
