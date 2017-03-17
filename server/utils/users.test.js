const expect = require('expect');

const { Users } = require('./users');

describe('Users', () => {
    let users;

    beforeEach(() => {
        // initializing test data
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Ana',
            room: 'JavaScript fans'
        }, {
            id: '2',
            name: 'Brian',
            room: 'Node fans'
        }, {
            id: '3',
            name: 'Julie',
            room: 'Node fans'
        }];
    });

    it('should add new user', () => {
        const users = new Users();
        const user = {
            id: '123',
            name: 'Brian',
            room: 'Game of Thrones Fans'
        };
        const resUser = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    it('should remove a user', () => {
        const userID = '1';
        const removedUser = users.removeUser(userID);

        expect(removedUser.id).toBe(userID);
        expect(users.users.length).toBe(2);
    });

    it('should not remove user', () => {
        const userID = '99';
        const removedUser = users.removeUser(userID);

        expect(removedUser).toNotExist();
        expect(users.users.length).toBe(3);
    });

    it('should find user', () => {
        const userID = '3';
        const fetchedUser = users.getUser(userID);

        expect(fetchedUser.id).toBe(userID);
    });

    it('should not find user', () => {
        const userID = '9999';
        const fetchedUser = users.getUser(userID);

        expect(fetchedUser).toNotExist();
    });

    it('should return names for Node fans', () => {
        const userList = users.getUserList('Node fans');

        expect(userList).toEqual(['Brian', 'Julie']);
    });

    it('should return names for JavaScript fans', () => {
        const userList = users.getUserList('JavaScript fans');

        expect(userList).toEqual(['Ana']);
    });
});
