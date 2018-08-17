/**
 * Primary file for the API
 */

// Dependencies

const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');
import models from './models/index';


// Instantiate the HTTP server
const httpServer = http.createServer((req, res) => {
    unifiedServer(req, res);
});

// Start the server, and have it listen on port 3000
httpServer.listen(config.httpPort, () => {
    console.log(`The server is listening on port ${config.httpPort}`);
});

// Instantiate the HTTPS server
// const httpsServerOptions = {
//     'key': fs.readFileSync('./https/key.pem'),
//     'cert': fs.readFileSync('./https/cert.pem')
// };

// const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
//     unifiedServer(req, res);
// });

// Start the server, and have it listen on port 3001
// httpsServer.listen(config.httpsPort, () => {
//     console.log(`The server is listening on port ${config.httpsPort}`);
// });

// All the server logic for both the http and https server
const unifiedServer = (req, res) => {
    // Get the URL and parse it
    const parseURL = url.parse(req.url, true);

    // Get the path
    const path = parseURL.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    const queryStringObject = parseURL.query;

    // Get the HTTP Method
    const method = req.method.toLowerCase();

    // Get the headers as an object
    const headers = req.headers;

    // Get the payload, if any
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    // As the data is streaming in, the req object emits a 'data' event.
    // We subscribe to this event and we decode with utf-8 and write to the buffer
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });

    // 'end' event always emitted even if there is no payload
    req.on('end', () => {
        buffer += decoder.end();

        // Choose the handler  this  request should go to
        const chosenHandler = router[trimmedPath] !== void 0 ? handlers[trimmedPath] : handlers.notFound;

        const data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': helpers.parseJsonToObject(buffer)
        };

        // Route the request to the handler specified in the router
        chosenHandler(data, (statusCode, payload) => {
            // Use the status code called back by the handler, or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            // Use the payload called back by the handler, or default to an empty object
            payload = typeof(payload) == 'object' ? payload : {};
            // Convert the payload to a string
            const payloadString = JSON.stringify(payload);
            // Return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
            // Log
            console.log('Return this response: ', statusCode, payloadString);
        });
    });
};


const router = {
    'users': handlers.users
};
