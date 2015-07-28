var parameters = require('../config/config.js');
var path = require('path');

module.exports = init;

function init(app) {
    require('./db')(parameters.mongodb);
    require('./routing')(app);
}