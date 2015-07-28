var parameters = require('./parameters');

module.exports = {
    mongodb: {
        host: parameters.mongodb_host,
        database: parameters.mongodb_name
    },
    center_of_galaxy: {
        x: 214,
        y: 210
    },
    secret: parameters.secret
};