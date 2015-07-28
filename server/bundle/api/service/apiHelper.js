var apiError =require('./apiError');

module.exports.requiredParams = requiredParams;

/**
 * Checks if req.body has the required params and returns an error if it does not.
 * Returns null otherwise.
 * @param {object} req
 * @param {Array} params Array of required params
 * @returns {object|null}
 */
function requiredParams(req, params) {
    try {
        params.forEach(function(param) {
            if(req.body[param] === undefined) {
                throw new Error(param);
            }
        });
    } catch (err) {
        return apiError.missingParameter(err.message);
    }

    return null;
}