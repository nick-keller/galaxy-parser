var controller = require('../controller/report');

module.exports = {
    endpoint: '/reports',
    params: {
    },
    actions: {
        Post: {
            path: '/',
            method: 'POST',
            required_params: ['report_id', 'place_id'],
            middleware: controller.post
        }
    }
};