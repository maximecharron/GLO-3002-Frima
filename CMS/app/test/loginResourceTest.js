var helpers = require('./../test/test-helpers');
var ngModule = helpers.module;
var inject = helpers.inject;
var expect = require('chai').expect;
require('../bower_components/angular-route');
require('../bower_components/angular-resource');
require('../bower_components/angular-cookies');
require('../components/login/scripts/services/loginResource');

const USER = {
    name: "username",
    email: "a@a.com"
};
describe('Login service', function() {
    beforeEach(function ()
    {
        ngModule('CMS.login');
        angular.module('CMS.login').config(function (envServiceProvider)
        {
            envServiceProvider.config({
                domains: {
                    development: ['localhost', 'dev.local']
                },
                vars: {
                    development: {
                        apiUrl: 'http://localhost:3000'
                    }
                }
            });

            envServiceProvider.check();
        })
    });
    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.when('POST','http://localhost:3000/login').respond(USER);
        this.$httpBackend = $httpBackend;
    }));

    afterEach(function() {
        this.$httpBackend.verifyNoOutstandingExpectation();
        this.$httpBackend.verifyNoOutstandingRequest();
    });

    describe('login method', function() {
        it('should return a list of bosses constant', function(done) {
            inject(function(loginResource) {
                var user = {
                    name: "username",
                    email: "a@a.com"
                };
                loginResource.post(user, function(user) {
                    expect(user.name).to.equal(USER.name);
                    done();
                });

                $httpBackend.flush();
            })
        });
    });
});