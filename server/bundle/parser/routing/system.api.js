var controller = require('../controller/system');

module.exports = {
    endpoint: '/systems',
    params: {
    },
    actions: {
        All: {
            path: '/parse',
            method: 'POST',
            required_params: 'sessid',
            middleware: controller.parse
        },
    }
};