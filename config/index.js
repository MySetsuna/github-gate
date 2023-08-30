
const fs = require('fs');

const TRUNCATE_THRESHOLD = 10;
const REVEALED_CHARS = 3;
const REPLACEMENT = '***';

function loadConfig() {
    const config = JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf-8'));
    console.log(config, __dirname + '/config.json');
    log('Configuration');
    for (const i in config) {
        let configItem = process.env[i.toUpperCase()] || config[i];
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

module.exports = { loadConfig, log };
