var controller = require('../controller/system');

module.exports = {
    endpoint: '/systems',
    params: {
    },
    actions: {
        Parse: {
            path: '/parse',
            method: 'POST',
            required_params: 'sessid',
            middleware: controller.parse
        }
    }
};