/**
 * Allow cross-origin resource sharing
 */
module.exports = function(req, res, next) {

    res.setHeader("Access-Control-Allow-Origin", "*");

    // Handle OPTIONS query, sent by browser before the real query
    if(req.method === 'OPTIONS') {
        res.setHeader("Access-Control-Allow-Methods", req.headers['access-control-request-method']);
        res.setHeader("Access-Control-Allow-Headers", req.headers['access-control-request-headers']);
        return res.end();
    }

    // Ensure that response will be sent as json and not HTML by the app
    req.headers['x-requested-with'] = 'XMLHttpRequest';

    next();
};