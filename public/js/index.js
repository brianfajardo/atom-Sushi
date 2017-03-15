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
    const li = $('<li></li>');
    li.text(`${msg.from}: ${msg.text}`);

    $('#messages').append(li);
});

$('#message-form').on('submit', function (e) {
    // prevents submit event's default page-refresh process
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User-client',
        text: $('[name=message]').val()
    }, function () {

    });
});
