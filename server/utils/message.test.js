const expect = require('expect');

const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
    it('should generate the correct message object', () => {
        const from = 'Green Ranger';
        const text = 'Alphaaaaaaaaaaa!';
        const message = generateMessage(from, text);

        expect(message).toBeA('object');
        expect(message).toInclude({ from, text });
        expect(message.createdAt).toBeA('number');
    });
});

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        const from = 'Waldo';
        const latitude = 150;
        const longitude = 50;
        const url = 'https://www.google.com/maps?q=150,50'
        const message = generateLocationMessage(from, latitude, longitude);

        expect(message).toBeA('object');
        expect(message).toInclude({ from, url });
        expect(message.createdAt).toBeA('number');
    });
});
