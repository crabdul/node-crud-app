/**
 * Request handlers
 */

// Dependencies
const _data = require('./data');
const helpers = require('./helpers');

// Define the handlers
const handlers = {};

handlers.users = (data, callback) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
}

handlers._users = {};

handlers._users.post = (data, callback) => {
    // Check that all required field are filled out
    const firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 11 ? data.payload.phone.trim() : false;
    const password = typeof(data.payload.phone) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    const tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // Make sure that the user doesn't  already exist
        _data.read('users', phone, (err, data) => {
            if(err) {
                // Hash the password
                const hashedPassword = helpers.hash(password);
                // Create the user object
                const userObject = {
                    'firstName': firstName,
                    'lastmame': lastName,
                    'phone': phone,
                    'hashedPassword': hashedPassword,
                    'tosAgreement': true
                };

                // Store the user
                _data.create('users', phone, userObject, (err) => {
                    if (!err) {
                        callback(200);
                    } else {
                        console.log(err);
                        callback(500, {'Error': 'Could not create the new user'});
                    }
                })
            } else {
                // User already exists
                callback(400, {'Error': 'A user with that phone number already exists'})
            }
        });
    } else {
        callback(400, {
            'Error': 'Missing required fields'
        });
    }
};

// Users - get
// Required data: phone
// Optional data: none
// TODO: Only let an authenticated user access their object. Don't let them access anything else
handlers._users.get = (data, callback) => {
    const phone = data.queryStringObject.phone;
    // Check that the phone number is valid
    const isPhoneNumberValid = typeof(phone) == 'string' && phone.trim().length == 11;
    if (isPhoneNumberValid) {
        // Lookup the user
        _data.read('users', phone, (err, data) => {
            if (!err && data) {
                // Remove the hashed password from the user
                delete data.hashedPassword;
                callback(200, data);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, {'Error': 'Missing required field'});
    }
};

handlers._users.put = (data, callback) => {

};

handlers._users.delete = (data, callback) => {

};

module.exports = handlers;
