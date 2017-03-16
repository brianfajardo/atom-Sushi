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
    const formattedTime = moment(msg.createdAt).format('h:mm a');

    // Select template DOM element
    const template = $('#message-template').html();
    // Render template with Mustache and object properties
    const html = Mustache.render(template, {
        text: msg.text,
        from: msg.from,
        timestamp: formattedTime
    });

    $('#messages').append(html);
});

socket.on('newLocationMessage', (msg) => {
    const formattedTime = moment(msg.createdAt).format('h:mm a');

    const template = $('#location-message-template').html();
    const html = Mustache.render(template, {
        from: msg.from,
        url: msg.url,
        timestamp: formattedTime
    });

    $('#messages').append(html);
});

$('#message-form').on('submit', function (e) {
    // prevents submit event's default page-refresh process
    e.preventDefault();
    const msgTxtBox = $('[name=message]');

    socket.emit('createMessage', {
        from: 'User-client',
        text: msgTxtBox.val()
    }, function () {
        msgTxtBox.val('');
    });
});

const locationButton = $('#send-location');
locationButton.on('click', function (e) {
    console.log(e);
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');

    // Starts process to actively find co-ordinates based on browser
    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function () {
        alert('Unable to fetch location.');
        locationButton.removeAttr('disabled').text('Send location');
    });
});
