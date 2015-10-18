var express = require("express");
var path = require('path');
var api = require('./../bundle/api/restful');
var cors = require("./../bundle/api/controller/corsController");

module.exports = init;

function init(app) {
    app.use(cors);
    app.use('/api', api);
    app.use(express.static(path.join(__dirname, '../../client/public')));
    app.use('/', serveSearch);
    app.use(notFound);
    app.use(logErrors);
    app.use(errorHandler);
}

function serveSearch(req, res, next) {
    // res.sendFile(path.join(__dirname, '../bundle/search/view/search.html'));
    res.status(404).send('404 Not found');
}

function notFound(req, res, next) {
    var err = {
        status: 404
    };

    next(err);
}

function logErrors(err, req, res, next) {
    if(err.stack) {
        console.log(err);
        console.error(err.stack);
    }

    next(err);
}

function errorHandler(err, req, res, next) {
    err.status = err.status || 500;
    res.status(err.status);

    if(err.error === undefined) {
        switch(err.status) {
            case 400:
                err.error = 'bad_request';
                break;
            case 401:
                err.error = 'unauthorized';
                break;
            case 404:
                err.error = 'not_found';
                err.message = err.message || 'Cette page n\'existe pas.';
                break;
            case 500:
                err.error = 'internal_error';
                err.message = err.message || 'Une erreur est survenue.';
                break;
        }
    }

    res.json(err);
}