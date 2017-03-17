const expect = require('expect');

const { isRealString } = require('./validation');

describe('isRealString', () => {
    it('should allow for real string values', () => {
        const result = isRealString('I\'m a real string!');
        expect(result).toBe(true);
    });

    it('should allow strings with non-space characters', () => {
        const result = isRealString('   L O T R   ');
        expect(result).toBe(true);
    });

    it('should reject non-string values', () => {
        const result = isRealString(1);
        expect(result).toBe(false);
    });

    it('should reject string with only spaces', () => {
        const result = isRealString('     ');
        expect(result).toBe(false);
    });
});
