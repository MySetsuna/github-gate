
var fs = require('fs');
var path = require('path')

var TRUNCATE_THRESHOLD = 10;
var REVEALED_CHARS = 3;
var REPLACEMENT = '***';

function loadConfig() {
    var config;
    if (process.env.NODE_ENV === 'production') {
        config = JSON.parse(fs.readFileSync(path.resolve('config.json'), 'utf-8'));
    } else {
        config = JSON.parse(fs.readFileSync(path.resolve('config-dev.json'), 'utf-8'));
    }
    log('Configuration');
    for (var i in config) {
        var configItem = process.env[i.toUpperCase()] || config[i];
        if (typeof configItem === 'string') {
            configItem = configItem.trim();
        }
        config[i] = configItem;
        if (i === 'oauth_client_id' || i === 'oauth_client_secret') {
            log(i + ':', config[i], true);
        } else {
            log(i + ':', config[i]);
        }
    }
    return config;
}

/**
 * Handles logging to the console.
 * Logged values can be sanitized before they are logged
 *
 * @param {string} label - label for the log message
 * @param {Object||string} value - the actual log message, can be a string or a plain object
 * @param {boolean} sanitized - should the value be sanitized before logging?
 */
function log(label, value, sanitized) {
    value = value || '';
    if (sanitized) {
        if (typeof (value) === 'string' && value.length > TRUNCATE_THRESHOLD) {
            console.log(label, value.substring(REVEALED_CHARS, 0) + REPLACEMENT);
        } else {
            console.log(label, REPLACEMENT);
        }
    } else {
        console.log(label, value);
    }
}
var config = loadConfig()
module.exports = { config, log };
