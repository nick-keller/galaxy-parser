var mongoose = require("mongoose");
var System = mongoose.model('System');
var queue = require("queue");
var request = require("request");
var config = require("../../../config/config");

module.exports = parse;

var parsing = false;

var userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/43.0.2357.130 Chrome/43.0.2357.130 Safari/537.36';
var origin    = 'http://asylamba.com';

function parse(sessid, callback) {

    // Make sure we are not already parsing
    if(parsing) {
        return callback({
            status: 403,
            message: 'Already parsing systems.'
        })
    }

    parsing = true;

    request.get({
        url: 'http://game.asylamba.com/s10/map',
        headers: {
            'User-Agent': userAgent,
            Origin: origin,
            Referer: 'http://game.asylamba.com/s10/bases',
            Cookie: 'PHPSESSID=' + sessid
        },
        followRedirect: false
    }, function (err, httpResponse, body) {
        if(err) {
            parsing = false;
            return callback(err);
        }

        if(302 === httpResponse.statusCode) {
            parsing = false;
            return callback({
                status: 400,
                message: 'Invalid sessid.'
            });
        }

        // Exec callback while we do the hard work
        callback();

        // Remove every system first
        System.remove({}, function() {

            var systems = body.match(/data-system-id="\d+" data-x-position="\d+" data-y-position="\d+"/g);
            var q = queue();
            var errors = 0;

            systems.forEach(function(system) {
                q.push(function(next) {
                    var data = system.match(/data-system-id="(\d+)" data-x-position="(\d+)" data-y-position="(\d+)"/);

                    (new System({
                        _id: data[1],
                        x: data[2],
                        y: data[3],
                        dist: Math.sqrt(Math.pow(data[2] - config.center_of_galaxy.x, 2) + Math.pow(data[3] - config.center_of_galaxy.y, 2))
                    }))
                        .save(function(err) {
                            if (err) {
                                errors++;
                            }

                            next();
                        });
                });
            });

            q.start(function() {
                console.log('Saved ' + (systems.length - errors) + ' systems.');
                console.log('Failed to save ' + errors + ' systems.');
                parsing = false;
            });
        });
    });
}