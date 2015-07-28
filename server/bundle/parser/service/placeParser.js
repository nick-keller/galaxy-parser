var mongoose = require("mongoose");
var System = mongoose.model('System');
var Place = mongoose.model('Place');
var queue = require("queue");
var request = require("request");

module.exports = parse;

var parsing = false;

var userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/43.0.2357.130 Chrome/43.0.2357.130 Safari/537.36';

function parse(sessid, callback) {

    // Make sure we are not already parsing
    if(parsing) {
        return callback({
            status: 403,
            message: 'Already parsing places.'
        })
    }

    parsing = true;

    request.get({
        url: 'http://game.asylamba.com/s7/bases',
        headers: {
            'User-Agent': userAgent,
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

        System.find({}).sort({ dist: 1 }).limit(1).exec(function(err, systems) {
            if(err) {
                return console.log(err);
            }

            var q = queue({concurrency: 1});
            var totalResponseTime = 0;
            var totalCalls = 0;

            systems.forEach(function(system) {
                q.push(function(next) {

                    var sentAt = Date.now();
                    console.log('Parsing system ' + system._id);

                    request.get({
                        url: 'http://game.asylamba.com/s7/ajax/a-loadsystem/systemid-' + system._id + '/relatedplace-13963',
                        headers: {
                            Accept: '*/*',
                            'Accept-Encoding': 'gzip, deflate, sdch',
                            'Accept-Language': 'fr-FR,fr;q=0.8,en-US;q=0.6,en;q=0.4,',
                            Connection: 'keep-alive',
                            'X-Requested-With': 'XMLHttpRequest',
                            'User-Agent': userAgent,
                            Host: 'game.asylamba.com',
                            Cookie: 'PHPSESSID=' + sessid
                        },
                        followRedirect: false
                    }, function (err, httpResponse, body) {

                        var responseTime = Date.now() - sentAt;
                        totalCalls++;
                        totalResponseTime += responseTime;

                        console.log('    Got response in ' + responseTime/1000 + ' s');
                        console.log('    Average response time ' + totalResponseTime/totalCalls/1000 + ' s');

                        if(302 === httpResponse.statusCode) {
                            parsing = false;
                            return q.end('Sessid not valid anymore');
                        }

                        // TODO

                        var waitFor = Math.floor(Math.random() * (3000 - 500)) + 500;
                        console.log('    Waiting for ' + Math.round(waitFor / 1000) + 's');

                        setTimeout(next, waitFor);
                    });
                });
            });

            q.start(function(err) {
                if(err) {
                    console.log(err);
                }

                console.log('Parsed ' + totalCalls + ' systems')
            });
        });
    });
}