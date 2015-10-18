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
            $gte: parseInt(req.body.from.x) - 30,
            $lte: parseInt(req.body.from.x) + 30
        },
        y: {
            $gte: parseInt(req.body.from.y) - 30,
            $lte: parseInt(req.body.from.y) + 30
        }
    };

    var $and = [];

    if(req.body.with_report) {
        query.last_report = { $exists: true };
    }

    if(req.body.available !== undefined && req.body.habitable !== false) {
        query.owner = { $exists: !req.body.available};
    }

    if(req.body.habitable !== undefined) {
        query.habitable = req.body.habitable;
    }

    if(req.body.population) {
        $and.push({$or: [
            {population: { $in: req.body.population }},
            {population: { $exists: false }}
        ]});
    }

    if(req.body.defense) {
        $and.push({$or: [
            {defense: { $in: req.body.defense }},
            {defense: { $exists: false }}
        ]});
    }

    if(req.body.resource) {
        $and.push({$or: [
            {resource: { $in: req.body.resource }},
            {resource: { $exists: false }}
        ]});
    }

    if(req.body.science) {
        $and.push({$or: [
            {science: { $in: req.body.science }},
            {science: { $exists: false }}
        ]});
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
            { 'first_line.pev': {$gte: req.body.first_line.min || 0, $lte: req.body.first_line.max || 999999}}
        ]});
    }

    if($and.length) {
        query.$and = $and;
    }

    Place.find(query, function(err, places) {
        if(err) {
            return next(apiError.mongooseError(err));
        }

        res.json(places);
    });
}