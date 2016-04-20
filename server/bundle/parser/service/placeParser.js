var mongoose = require("mongoose");
var System = mongoose.model('System');
var Place = mongoose.model('Place');
var queue = require("queue");
var request = require("request");
var cheerio = require("cheerio");

module.exports = parse;

var parsing = false;

var userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/43.0.2357.130 Chrome/43.0.2357.130 Safari/537.36';

function parse(sessid, relatedplace, callback) {

    // Make sure we are not already parsing
    if(parsing) {
        return callback({
            status: 403,
            message: 'Already parsing places.'
        })
    }

    parsing = true;

    request.get({
        url: 'http://game.asylamba.com/s10/bases',
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

        if(299 < httpResponse.statusCode) {
            parsing = false;
            return callback({
                status: 400,
                message: 'Invalid sessid.'
            });
        }

        // Exec callback while we do the hard work
        callback();

        System.find({}).sort({ dist: 1 }).exec(function(err, systems) {
            if(err) {
                return console.log(err);
            }

            var q = queue({concurrency: 1});
            var totalResponseTime = 0;
            var totalCalls = 0;
            var totalPlaces = 0;

            // Fetch each system
            systems.forEach(function(system, i) {
                q.push(function(next) {

                    var sentAt = Date.now();
                    console.log('Parsing system ' + system._id + ' (' + (i+1) + ' / ' + systems.length + ')');

                    request.get({
                        url: 'http://game.asylamba.com/s10/ajax/a-loadsystem/systemid-' + system._id + '/relatedplace-' + relatedplace,
                        headers: {
                            Accept: '*/*',
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

                        if(299 < httpResponse.statusCode) {
                            parsing = false;
                            return q.end('>> Sessid not valid anymore');
                        }

                        var $ = cheerio.load(body);
                        var placesInSystem = 0;
                        var savingQ = queue();

                        $('div.system .action').each(function() {
                            var $this = $(this).find('.column.info');
                            var data = {
                                system : system._id,
                                x: system.x,
                                y: system.y
                            };

                            // Name
                            data.name = $this.find('p').first().text();

                            // Owner
                            var owner = $this.html().match(/<a href="http:\/\/game\.asylamba\.com\/s10\/embassy\/player-(\d+)"[^>]*>([^<]+)<\/a>/);
                            if(owner) {
                                data.owner = {
                                    id: owner[1],
                                    name: owner[2]
                                }
                            }

                            // Info
                            $this.find('.label').each(function() {
                                var $label = $(this);
                                var count = $label.next().find('img').length;

                                if('Population' === $label.text()) {
                                    data.population = count;
                                }
                                else if('Ressource' === $label.text()) {
                                    data.resource = count;
                                }
                                else if('Science' === $label.text()) {
                                    data.science = count;
                                }
                                else if($label.text().match(/D.fense/)) {
                                    data.defense = count;
                                }
                            });

                            // Habitable
                            data.habitable = !!data.resource;

                            // Habitable places
                            var placeId = $this.next().html().match(/http:\/\/game\.asylamba\.com\/s10\/action\/a-[^\/]+\/commanderid-\{id}\/placeid-(\d+)\//);

                            // Non habitable places
                            if(!placeId) {
                                placeId = $this.next().html().match(/http:\/\/game\.asylamba\.com\/s10\/action\/a-createmission\/rplace-\d+\/rtarget-(\d+)\//);
                            }

                            // Id
                            if(placeId) {
                                data._id = parseInt(placeId[1]);
                            }

                            placesInSystem++;

                            savingQ.push(function(next) {
                                Place.findOne({_id: data._id}, function(err, place) {
                                    if(err) {
                                        return next();
                                    }

                                    if(place) {
                                        Place.update({_id: data._id}, {$set: data}, next);
                                    } else {
                                        (new Place(data)).save(next);
                                    }
                                })
                            });
                        });

                        savingQ.start(function() {
                            totalPlaces += placesInSystem;
                            console.log('    ' + placesInSystem + ' places found');

                            var waitFor = Math.floor(Math.random() * (3000 - 500)) + 500;
                            console.log('    Waiting for ' + Math.round(waitFor / 1000) + 's');

                            setTimeout(next, waitFor);
                        });
                    });
                });
            });

            // Start fetching each system
            q.start(function(err) {
                if(err) {
                    console.log(err);
                }

                console.log('Parsed ' + totalCalls + ' systems');
                console.log(totalPlaces + ' places found');
                parsing = false;
            });
        });
    });
}