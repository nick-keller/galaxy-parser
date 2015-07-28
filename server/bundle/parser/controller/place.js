var parse = require('../service/placeParser');

module.exports = {
    parse: parseAction
};

function parseAction(req, res, next) {
    parse(req.body.sessid, function(err) {
        if (err) {
            return next(err);
        }

        next({
            status: 200,
            message: 'Parsing...'
        });
    });
}