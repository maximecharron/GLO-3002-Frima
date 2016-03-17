var url = require('url');
var UserModel = require('../models/user').model;
var jwt = require('jwt-simple');

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
                return response.status(401).send({
                    errorCode: 'ACCESS_DENIED',
                    message: 'Access token is expired'
                });
            }
            UserModel.findOne({'_id': decoded.iss}, function (err, user)
            {
                if (!err)
                {
                    if (user)
                    {
                        console.log(user.isSuperAdmin);
                        if (checkForSuperAdmin && !user.isSuperAdmin)
                        {
                            return response.status(401).send({
                                errorCode: 'ACCESS_DENIED',
                                message: 'User is not super Admin'
                            });
                        }
                        request.user = user;
                        return next();
                    } else
                    {
                        return response.status(401).send({
                            errorCode: 'ACCESS_DENIED',
                            message: 'User associated with token was not found'
                        });
                    }
                }
            });
        } catch (err)
        {
            return response.status(401).send({
                errorCode: 'ACCESS_DENIED',
                message: 'Error retrieving user associated with token'
            });
        }
    } else
    {
        return response.status(401).send({
            errorCode: 'ACCESS_DENIED',
            message: 'Access token is missing'
        });
    }
};

exports.retrieveToken = function (req)
{
    var parsed_url = url.parse(req.url, true);

    return (req.body && req.body.access_token) ||
        parsed_url.query.access_token ||
        req.headers.authorization;
};
