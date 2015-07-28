var apiHelper = require("../service/apiHelper");

module.exports = requiredParams;

/**
 * Checks that all params are available in req.body, returns an error to the client otherwise.
 * @param {array} params
 * @returns {Function} middleware
 */
function requiredParams(params) {

    if(_.isString(params)) {
        params = [params];
    }

    return function(req, res, next) {
        var err = apiHelper.requiredParams(req, params);

        if(err) {
            return next(err);
        }

        next();
    }
}