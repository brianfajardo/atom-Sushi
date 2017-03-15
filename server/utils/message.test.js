const expect = require('expect');

const { generateMessage } = require('./message');

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
