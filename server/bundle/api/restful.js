var express = require('express');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var requiredParams = require("./middleware/requiredParams");

var restful = express();
module.exports = restful;

init();

function init() {
    var entities = getEntities();

    entities.forEach(function(entity) {
        // Create a router for each entity
        var router = express.Router();

        // Register middlewares
        registerGlobalMiddlewares();
        registerActions();

        // Plug router into app
        restful.use(entity.endpoint, router);

        function registerGlobalMiddlewares() {
            // Register params converters
            _.forEach(entity.params, function(paramConverter, paramName) {
                router.param(paramName, paramConverter);
            });
        }

        function registerActions() {
            _.forEach(entity.actions, function(config) {

                var middlewares = [];

                if(config.required_params) {
                    middlewares.push(requiredParams(config.required_params));
                }

                router[config.method.toLowerCase()](
                    config.path,
                    _.flattenDeep([middlewares, config.middleware])
                );
            });
        }
    });
}

/**
 * Searches every route configs in /bundle/{bundleName}/routing/{route}.api.js
 * @returns {Array} found route configs
 */
function getEntities() {

    var entities = [];
    var bundleDir = path.join(__dirname, '..');

    fs.readdirSync(bundleDir)
        .map(function(file) {
            return path.join(bundleDir, file);
        })
        .filter(function (file) {
            return fs.statSync(file).isDirectory();
        })
        .forEach(function(bundle) {
            var routingDir = path.join(bundle, 'routing');

            try {
                fs.readdirSync(routingDir).forEach(function (file) {
                    if (~file.indexOf('.api.js')) {
                        entities.push(require(path.join(routingDir, file)));
                    }
                });
            } catch(err) {
                if(err.code !== 'ENOENT') {
                    console.log(err.stack);
                }
            }
        })
    ;

    return entities;
}