var passport = require('passport');
var request = require('request');
var User = require('../models/user').model;
var moment = require('moment');
var jwt = require('jwt-simple');
var tokenSecret = 'FRIMA_TOKEN_SECRET' || process.env.TOKEN_SECRET;

var authentication = require('../middleware/authentication');

exports.passportLogin = passport.authenticate('local-login', {
    successRedirect: '/token',
    failureRedirect: '/login',
    failureFlash: true
});

exports.getToken = function (req, res) {
    if (req.user) {
        res.send(req.user);
    } else {
        var token = authentication.retrieveToken(req);
        if (token) {
            res.status(401).send({
                errorCode: 'ACCESS_DENIED',
                message: 'User associated with token was not found'
            });
        } else {
            res.status(401).send({
                errorCode: 'ACCESS_DENIED',
                message: 'Access token is missing'
            });
        }
    }
    req.session.destroy();
};

exports.logout = function (req, res) {
    req.session.destroy();
    req.logout();
    res.status(200).send();
};


function createJWT(user) {
    var expires = moment().add(1, 'days').valueOf();
    user.token = jwt.encode(
        {
            iss: user.id,
            exp: expires
        },
        tokenSecret
    );
    return user.token;
}

