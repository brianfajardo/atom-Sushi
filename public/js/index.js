// Making a request from the client to open up a socket to 
// the web server and maintain the connection

const socket = io();

// Using vanilla JS function notation to allow for mobile support
socket.on('connect', function () {
    console.log('Connected to server.');
});

socket.on('disconnect', function () {
    console.log('Disconnected from server.');
});

socket.on('newMessage', (msg) => {
    console.log('newMessage', msg);
});
