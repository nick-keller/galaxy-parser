var controller = require('../controller/place');

module.exports = {
    endpoint: '/places',
    params: {
    },
    actions: {
        All: {
            path: '/parse',
            method: 'POST',
            required_params: 'sessid',
            middleware: controller.parse
        }
    }
};