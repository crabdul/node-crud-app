/**
 * Request handlers
 */

// Define the handlers
const handlers = {};

// Ping handler
handlers.ping = (data, callback) => {
    callback(200);
};

// Not found handler
handlers.notFound = (data, callback) => {
    callback(404);
};

module.exports = handlers;
