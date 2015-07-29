var controller = require('../controller/place');

module.exports = {
    endpoint: '/places',
    params: {
    },
    actions: {
        Search: {
            path: '/search',
            method: 'POST',
            required_params: 'from',
            middleware: controller.search
        }
    }
};