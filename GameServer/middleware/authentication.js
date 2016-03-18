var url = require('url');
var UserModel = require('../models/user').model;
var jwt = require('jwt-simple');
const UNAUTHORIZED = 401;

exports.isAuthenticated = function (request, response, nextFunction) {
    var token = exports.retrieveToken(request);

    if (token) {
        try {
            var decoded = jwt.decode(token, 'FRIMA_TOKEN_SECRET');

            if (decoded.exp <= Date.now()) {
                return response.status(UNAUTHORIZED).send({
                    errorCode: 'ACCESS_DENIED',
                    message: 'Access token is expired'
                });
            }

            UserModel.findOne({ '_id': decoded.iss }, function (err, user) {
                if (!err) {
                    if (user) {
                        request.user = user;
                        return nextFunction();
                    } else {
                        return response.status(UNAUTHORIZED).send({
                            errorCode: 'ACCESS_DENIED',
                            message: 'User associated with specified token was not found'
                        });
                    }
                }
            });
        } catch (err) {
            return response.status(UNAUTHORIZED).send({
                errorCode: 'ACCESS_DENIED',
                message: 'An error occured while retrieving the user associated with this token'
            });
        }

    } else {
        return response.status(UNAUTHORIZED).send({
            errorCode: 'ACCESS_DENIED',
            message: 'Access token is missing'
        });
    }
};

exports.retrieveToken = function (request) {
    var parsed_url = url.parse(request.url, true);

    return (request.body && request.body.access_token) ||
        parsed_url.query.access_token ||
        request.headers.authorization;
};