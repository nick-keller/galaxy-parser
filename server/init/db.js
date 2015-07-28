var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');

module.exports = init;

function init(parameters) {

    initConnection(parameters);
    initModels();
}

function initConnection(parameters) {

    var connect = function () {
        var options = { server: { socketOptions: { keepAlive: 1 } } };
        mongoose.connect('mongodb://' + parameters.host + '/' + parameters.database, options);
    };

    mongoose.connection.on('error', function(err) {
        console.log(err);
        process.exit(1);
    });

    mongoose.connection.on('disconnected', connect);

    connect();
}

/**
 * Registers every models in /bundle/{bundleName}/model
 */
function initModels() {

    var bundleDir = path.join(__dirname, '../bundle');

    fs.readdirSync(bundleDir)
        .map(function(file) {
            return path.join(bundleDir, file);
        })
        .filter(function (file) {
            return fs.statSync(file).isDirectory();
        })
        .forEach(function(bundle) {
            var modelDir = path.join(bundle, 'model');

            try {
                fs.readdirSync(modelDir).forEach(function (file) {
                    if (~file.indexOf('.js'))
                        require(path.join(modelDir, file));
                });
            } catch(err) {
                if(err.code !== 'ENOENT') {
                    console.log(err.stack);
                }
            }
        })
    ;
}