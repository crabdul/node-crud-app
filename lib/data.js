/**
 * Library for storing and editing data
 */

// Dependencies
const fs = require('fs');
const path = require('path');

// Container for the module (to be exported)
const lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data/');

// Write data to a file
lib.create = (dir, file, data, cb) => {
    // Open the file for writing
    fs.openSync(lib.baseDir + dir + '/' + file + '.json', 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // Convert data to string
            const stringData = JSON.stringify(data);
            // Write to file and close it
            fs.writeFile(fileDescriptor, stringData, (err) => {
                if (!err) {
                    fs.close(fileDescriptor, (err) => {
                        if (!err) {
                            cb(false);
                        } else {
                            cb('Error closing new file');
                        }
                    });
                } else {
                    cb('Error writing to new file');
                }
            });
        } else {
            cb('Could not create new file, it may already exist');
        }
    });
};

// Export the module
module.exports = lib;
