var url = require('url');
var UserModel = require('../models/user').model;
var jwt = require('jwt-simple');
const UNAUTHORIZED = 401;

exports.isAuthenticatedAsSuperAdmin = function (request, response, next)
{
    exports.isAuthenticated(request, response, next, true);
}

exports.isAuthenticated = function (request, response, next, checkForSuperAdmin)
{
    var token = exports.retrieveToken(request);
    if (token)
    {
        try
        {
            var decoded = jwt.decode(token, 'CMS_TOKEN_SECRET');

            if (decoded.exp <= Date.now())
            {
                return response.status(UNAUTHORIZED).send({
                    errorCode: 'ACCESS_DENIED',
                    message: 'Access token is expired'
                });
            }
            UserModel.findOne({'_id': decoded.iss}, function (error, user)
            {
                if (!error)
                    if (user)
                    {
                        console.log(user.isSuperAdmin);
                        if (checkForSuperAdmin && !user.isSuperAdmin)
                        {
                            return response.status(UNAUTHORIZED).send({
                                errorCode: 'ACCESS_DENIED',
                                message: 'User is not super Admin'
                            });
                        }
                        request.user = user;
                        return next();
                    } else
                    {
                        return response.status(UNAUTHORIZED).send({
                            errorCode: 'ACCESS_DENIED',
                            message: 'User associated with token was not found'
                        });
                    }
            });
        }
        catch
            (error)
        {
            return response.status(UNAUTHORIZED).send({
                errorCode: 'ACCESS_DENIED',
                message: 'Error retrieving user associated with token'
            });
        }
    }
    else
    {
        return response.status(UNAUTHORIZED).send({
            errorCode: 'ACCESS_DENIED',
            message: 'Access token is missing'
        });
    }
}
;

exports.retrieveToken = function (request)
{
    var parsed_url = url.parse(request.url, true);
    return (request.body && request.body.access_token) ||
        parsed_url.query.access_token ||
        request.headers.authorization;
};
