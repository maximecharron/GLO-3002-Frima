var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user').model;
var moment = require('moment');
var jwt = require('jwt-simple');

// load the auth variables
var configAuth = require('./auth');

module.exports = function (passport, app) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {


            process.nextTick(function () {
                User.findOne({ 'email': email }, function (err, user) {
                    if (err) {
                        return done(err);
                    }

                    if (!user || !user.validPassword(password)) {
                        return done(null, false);
                    }

                    var expires = moment().add(1, 'days').valueOf();
                    user.token = jwt.encode(
                        {
                            iss: user.id,
                            exp: expires
                        },
                        app.get('jwtTokenSecret')
                    );

                    user.save(function (err) {
                        if (err) {
                            return done(err);
                        }

                        return done(null, user.toDTO(true, true));
                    });
                });
            });
        }));

    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            if (email) {
                email = email.toLowerCase();
            }
            process.nextTick(function () {
                if (!req.user) {
                    User.findOne({ 'email': email }, function (err, user) {
                        if (err) {
                            return done(err);
                        }

                        if (user) {
                            return done("The user with email " + email + " already exists and could not be created.");
                        } else {
                            var newUser = new User();

                            newUser.email = email;
                            newUser.username = req.body.username;
                            newUser.password = newUser.generateHash(password);
                            newUser.save(function (err) {
                                if (err) {
                                    console.log(err);
                                    return done(err);
                                }
                                return done(null, newUser.toDTO(true));
                            });
                        }
                    });
                } else if (!req.user.username) {
                    var user = req.user;
                    user.username = username;
                    user.password = user.generateHash(password);
                    user.save(function (err) {
                        if (err) {
                            return done(err);
                        }

                        return done(null, user.toDTO(true));
                    });
                } else {
                    return done(null, req.user);
                }
            });

        }));

    passport.use('facebook-login', new FacebookStrategy({

        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret
    },
        function(token, refreshToken, profile, done) {

            // asynchronous
            process.nextTick(function() {

                User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        var newUser            = new User();
                        console.log(profile);

                        newUser.facebook.id    = profile.id; // set the users facebook id
                        newUser.facebook.token = token; // we will save the token that facebook provides to the user
                        newUser.facebook.username  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                        newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                        newUser.save(function(err) {
                            if (err)
                                throw err;

                            return done(null, newUser);
                        });
                    }

                });
            });

        }));

};

