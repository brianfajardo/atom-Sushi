// Making a request from the client to open up a socket to 
// the web server and maintain the connection

const socket = io();

function scrollToBottom() {
    // Selectors
    const messages = $('#messages');
    const newMessage = messages.children('li:last-child');

    // Heights
    const clientHeight = messages.prop('clientHeight'); /* get property value */
    const scrollTop = messages.prop('scrollTop');
    const scrollHeight = messages.prop('scrollHeight');
    const newMessageHeight = newMessage.innerHeight();
    const lastMessageHeight = newMessage.prev().innerHeight();

    // if client meets min scroll height req should auto scroll to the bottom/latest message
    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

// Using vanilla JS function notation to allow for mobile support
socket.on('connect', function () {
    console.log('Connected to server.');
    const params = $.deparam(window.location.search);

    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            // if err redirect user back to join page
            window.location.href = '/';
        } else {
            console.log('No errors');
        }
    });
});

socket.on('disconnect', function () {
    console.log('Disconnected from server.');
});

socket.on('updateUserList', function(users) {
    const ol = $('<ol></ol>');

    users.forEach(function (user) {
        ol.append($('<li></li>').text(user));
    });

    $('#users').html(ol);
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
    scrollToBottom();
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
    scrollToBottom();
});

$('#message-form').on('submit', function (e) {
    // prevents submit event's default page-refresh process
    e.preventDefault();
    const msgTxtBox = $('[name=message]');

    socket.emit('createMessage', {
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
