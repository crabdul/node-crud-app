/**
 * Primary file for the API
 */

// Dependencies

const http = require('http');
const url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

// The server should respond with a string
const server = http.createServer((req, res) => {
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

        // Send the response
        res.end('Hello World\n');
        // Log the request path

        console.log('Request received with this payload: ', buffer);
    });
});

// Start the server, and have it listen on port 3000
server.listen(3000, () => {
    console.log('The server is listening on port 3000 now');
});
