var mongoose = require('mongoose');
var Place = mongoose.model('Place');
var _ = require('lodash');
var apiError = require('../../api/service/apiError');

module.exports = {
    search: searchAction
};

function searchAction(req, res, next) {
    var query = {
        x: {
            $gte: req.body.from.x -30,
            $lte: req.body.from.x +30
        },
        y: {
            $gte: req.body.from.y -30,
            $lte: req.body.from.y +30
        }
    };

    var $and = [];

    if(req.body.habitable !== undefined) {
        query.habitable = req.body.habitable;
    }

    if(req.body.available !== undefined) {
        query.owner = { $exists: !req.body.available};
    }

    if(req.body.population) {
        query.population = { $in: req.body.population};
    }

    if(req.body.defense) {
        query.defense = { $in: req.body.defense};
    }

    if(req.body.resource) {
        query.resource = { $in: req.body.resource};
    }

    if(req.body.science) {
        query.science = { $in: req.body.science};
    }

    if(req.body.inhabitants !== undefined) {
        $and.push({$or: [
            { inhabitants: {$exists: false} },
            { inhabitants: {$gte: req.body.inhabitants}}
        ]});
    }

    if(req.body.resource_ratio !== undefined) {
        $and.push({$or: [
            { resource_ratio: {$exists: false} },
            { resource_ratio: {$gte: req.body.resource_ratio}}
        ]});
    }

    if(req.body.science_bonus !== undefined) {
        $and.push({$or: [
            { science_bonus: {$exists: false} },
            { science_bonus: {$gte: req.body.science_bonus}}
        ]});
    }

    if(req.body.warehouses !== undefined) {
        $and.push({$or: [
            { warehouses: {$exists: false} },
            { warehouses: {$gte: req.body.warehouses}}
        ]});
    }

    if(req.body.first_line !== undefined) {
        $and.push({$or: [
            { 'first_line.pev': {$exists: false} },
            { 'first_line.pev': {$gte: req.body.first_line.min, $lte: req.body.first_line.max}}
        ]});
    }

    if($and.length) {
        query.$and = $and;;
    }

    Place.find(query, function(err, places) {
        if(err) {
            return next(apiError.mongooseError(err));
        }

        res.json(places);
    });
}