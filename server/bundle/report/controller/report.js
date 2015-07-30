var mongoose = require('mongoose');
var Place = mongoose.model('Place');
var apiError = require('../../api/service/apiError');
var _ = require('lodash');

module.exports = {
    post: postAction,
    last: lastAction
};

function postAction (req, res, next) {
    Place.findOne({_id: req.body.place_id}, function(err, place) {
        if(err) {
            return next(apiError.mongooseError(err));
        }

        if(!place) {
            return next(apiError.badRequest({
                place_id: 'Cette planète n\'est pas répertoriée.'
            }));
        }

        // Outdated report
        if(req.body.report_id <= place.last_report) {
            return next({
                status: 200,
                message: 'Il y a déjà un raport plus récent.'
            });
        }

        var data = _.pick(
            req.body,
            'inhabitants resource_ratio science_bonus warehouses counterintelligence trade_routes first_line second_line'.split(' ')
        );
        data.last_checked = Date.now();
        data.last_report = req.body.report_id;

        if(req.body.coordinates) {
            var coordinates = req.body.coordinates.match(/^.(\d+). \d+:\d+:(\d+)$/);
            data.sector = coordinates[1];
            data.position = coordinates[2];
        }

        if(req.body.first_line) {
            _.remove(req.body.first_line, function(slot) {
                if(!slot) {
                    return false;
                }

                return _.some(slot.compo, function(a){
                    return a==-1;
                });
            });
        }

        if(req.body.second_line) {
            _.remove(req.body.second_line, function(slot) {
                if(!slot) {
                    return false;
                }

                return _.some(slot.compo, function(a){
                    return a==-1;
                });
            });
        }

        Place.update(
            {_id: req.body.place_id},
            {$set: data},
            function(err) {
                if(err) {
                    return next(apiError.mongooseError(err));
                }

                res.json({
                    status: 200,
                    message: 'Rapport enregistré.'
                });
            }
        );
    });
}

function lastAction(req, res, next) {
    Place.findOne({_id: req.params.id}, function(err, place) {
        if(err) {
            return next(apiError.mongooseError(err));
        }

        if(!place) {
            return next({
                status: 404,
                message: 'Cette planète n\'est pas référencée.'
            });
        }

        if(!place.last_report) {
            return next({
                status: 404,
                message: 'Aucun raport d\'espionage pour cette planète.'
            });
        }

        res.json(place);
    });
}