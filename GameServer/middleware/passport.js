var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user').model;
var userConfig = require('./../config/userConfig.js');
var moment = require('moment');
var jwt = require('jwt-simple');

module.exports = function (passport, app)
{
    passport.serializeUser(function (user, done)
    {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done)
    {
        User.findById(id, function (error, user)
        {
            done(error, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (request, username, password, done)
        {

            process.nextTick(function ()
            {
                User.findOne({'username': username}, function (error, user)
                {
                    if (error)
                    {
                        return done(error);
                    }

                    if (!user || !user.isValidPassword(password))
                    {
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

                    user.save(function (err)
                    {
                        if (err)
                        {
                            return done(err);
                        }

                        return done(null, user.toDTO(true));
                    });
                });
            });
        }));

    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (request, email, password, done)
        {
            if (email)
            {
                email = email.toLowerCase();
            }
            process.nextTick(function ()
            {
                if (!request.user)
                {
                    User.findOne({'email': email}, function (error, user)
                    {
                        if (error)
                        {
                            return done(error);
                        }

                        if (user)
                        {
                            var errorMessage = "The user with email " + email + " already exists and could not be created.";
                            return done(null, false, {message: errorMessage});
                        } else
                        {
                            User.findOne({'username': request.body.username}, function (err, user)
                            {
                                var newUser = new User();

                                newUser.email = email;
                                newUser.username = request.body.username;
                                newUser.password = newUser.generateHash(password);
                                newUser.currentXP = userConfig.currentXP;
                                newUser.pointNextLevel = userConfig.pointNextLevel;
                                newUser.XPNextLevel = userConfig.XPNextLevel;
                                newUser.level = userConfig.level;
                                newUser.attack = userConfig.attack;
                                newUser.stamina = userConfig.stamina;
                                newUser.hype = userConfig.hype;
                                newUser.save(function (error)
                                {
                                    if (error)
                                    {
                                        console.log(error);
                                        return done("An error occured. It may be that the username or email is already used.");
                                    }
                                    return done(null, newUser.toDTO(true));
                                });
                            });
                        }

                    });
                } else if (!request.user.username)
                {
                    var user = request.user;
                    user.username = username;
                    user.password = user.generateHash(password);
                    user.save(function (error)
                    {
                        if (error)
                        {
                            return done(error);
                        }

                        return done(null, user.toDTO(true));
                    });
                } else
                {
                    return done(null, request.user);
                }
            });

        }));
};

