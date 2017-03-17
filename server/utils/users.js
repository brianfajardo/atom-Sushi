class Users {
    constructor() {
        // users array can be accessed on all instance of class Users
        this.users = [];
    }
    addUser(id, name, room) {
        const user = { id, name, room };
        this.users.push(user);
        return user;
    }
    removeUser(id) {
        const removedUser = this.getUser(id);
        if (removedUser) {
            this.users = this.users.filter(user => user.id !== id);
        }
        return removedUser;
    }
    getUser(id) {
        return this.users.find(user => user.id === id);
    }
    getUserList(room) {
        return this.users
            .filter(user => user.room === room)
            .map(user => user.name);
        // const users = this.users.filter((user) => user.room === room);
        // const namesArray = users.map((user) => user.name);

        // return namesArray;
    }
}

module.exports = {
    Users
};
