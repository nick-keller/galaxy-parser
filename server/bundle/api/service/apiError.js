var _ = require('lodash');

module.exports = {
    mongooseError: mongooseError,
    notFound: notFound,
    missingParameter: missingParameter,
    badRequest: badRequest,
    accessDenied: accessDenied,
    unauthorized: unauthorized,
    badCredentials: badCredentials,
    tokenExpired: tokenExpired,
    tokenForged: tokenForged,
    refreshTokenForged: refreshTokenForged,
    unknownSchool: unknownSchool,
    missingSchoolHeader: missingSchoolHeader
};

function notFound(what) {
    return {
        status: 404,
        message: what ? what + ' n\'existe pas.' : 'Cette page n\'existe pas.'
    };
}

function missingParameter(parameter) {
    return {
        status: 400,
        error: 'missing_parameter',
        message: 'Le paramètre requis est manquant: ' + parameter
    };
}

function formError(err) {
    _.forOwn(err.errors, function(value, key) {
        err.errors[key] = value.message;
    });

    return {
        status: 400,
        message: 'Le formulaire n\'est pas valide.',
        errors: err.errors
    };
}

function badRequest(errors) {
    return {
        status: 400,
        message: 'Le formulaire n\'est pas valide.',
        errors: errors
    };
}

function mongooseError(err) {
    if(err.name === 'ValidationError') {
        return formError(err);
    } else {
        return {
            error: 'mongoose_error',
            message: err.message
        };
    }
}

function accessDenied() {
    return {
        status: 403,
        error: 'access_denied',
        message: 'Vous n\'avez pas accès à cette page.'
    };
}

function unauthorized() {
    return {
        status: 401,
        error: 'unauthorized',
        message: 'Vous devez vous connecter pour accéder à cette page.'
    };
}

function badCredentials() {
    return {
        status: 401,
        error: 'bad_credentials',
        message: 'Adresse ou mot de passe incorrect.'
    };
}

function tokenExpired() {
    return {
        status: 401,
        error: 'access_token_expired',
        message: 'La session a expiré.'
    };
}

function tokenForged() {
    return {
        status: 400,
        error: 'access_token_forged',
        message: 'La sessions semble contre-faite, essayez de vous reconnecter.'
    };
}

function refreshTokenForged() {
    return {
        status: 400,
        error: 'refresh_token_forged',
        message: 'La sessions semble contre-faite, essayez de vous reconnecter.'
    };
}

function unknownSchool(slug) {
    return {
        status: 400,
        error: 'unknown_school',
        message: 'L\'école ' + slug + ' n\'existe pas.'
    }
}

function missingSchoolHeader() {
    return {
        status: 400,
        error: 'missing_parameter',
        message: 'L\'en-tête School est obligatoire.'
    }
}