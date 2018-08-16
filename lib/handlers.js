/**
 * Request handlers
 */

// Define the handlers
const handlers = {};

handlers.users = (data, callback) {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
}

handlers._users = {};

handlers._users.post = (data, callback) {
    // Check that all required field are filled out
};

handlers._users.get = (data, callback) {

};

handlers._users.put = (data, callback) {

};

handlers._users.delete = (data, callback) {

};

module.exports = handlers;
