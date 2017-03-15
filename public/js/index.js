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

socket.on('newLocationMessage', (msg) => {
    const li = $('<li></li>');
    // _blank opens the linked document in a new window or tab so user isn't kicked from chatroom!
    const a = $('<a target="_blank">My current location</a>');

    li.text(`${msg.from}: `);
    // setting a attribute
    a.attr('href', msg.url);
    li.append(a);
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

const locationButton = $('#send-location');
locationButton.on('click', function (e) {
    console.log(e);
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }
    // Starts process to actively find co-ordinates based on browser
    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function () {
        alert('Unable to fetch location.');
    });
});