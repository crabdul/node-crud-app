/**
 * Request handlers
 */

// Dependencies
const _data = require('./data');
const helpers = require('./helpers');
const { user } = require('../models/index');

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

handlers._users.post = async (data, callback) => {
    // Check that all required field are filled out
    const firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 11 ? data.payload.phone.trim() : false;
    const password = typeof(data.payload.phone) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    const tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // Make sure that the user doesn't  already exist
        const {count} = await user.findAndCount({
            where: {
                phone: phone
            }
        });
        if (count == 0) {
            const hashedPassword = helpers.hash(password);
            // Create the user object
            const userObject = {
                'firstName': firstName,
                'lastmame': lastName,
                'phone': phone,
                'password': hashedPassword,
                'tosAgreement': true
            };
            user.create(userObject);
        } else {
            callback(400, {
                'Error': 'Entry already exists'
            })
        }
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
    const isPhoneNumberValid = _isPhoneNumberValid(phone);
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

// Users - put
// Required data: phone
handlers._users.put = (data, callback) => {
    const phone = data.queryStringObject.phone;
    // Check for the required field
    const isPhoneNumberValid = _isPhoneNumberValid(data.queryStringObject.phone);

    // Check for the optional fields
    const firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    const password = typeof(data.payload.phone) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    // Error if the phone is invalid
    if (isPhoneNumberValid) {
        // Error if nothing is sent to update
        if (firstName || lastName || password) {
            _data.read('users', phone, (err, userData) => {
                if (!err && userData) {
                    // Update the fields necessary
                    if (firstName) userData.firstName = firstName;
                    if (lastName) userData.lastName = lastName;
                    if (password) userData.password = password;
                    // Store the new updates
                    _data.update('users', phone, userData, (err)=> {
                        if (!err) {
                            callback(200, {'Success': 'User data updated'});
                        } else {
                            console.log(err);
                            callback(500, {'Error': 'Could not update the user'});
                        }
                    });
                } else {
                    callback(400, {'Error': 'The specified user does not exist'});
                }
            });
        } else {
            callback(400, {'Error': 'Missing fields to update'});
        }
    } else {
        callback(400, {'Error': 'Missing required field'});
    }

};

handlers._users.delete = (data, callback) => {

};

const _isPhoneNumberValid = (phone) => {
    return typeof(phone) == 'string' && phone.trim().length == 11;
};

module.exports = handlers;
