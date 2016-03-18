var helpers = require('./../test/test-helpers');
var ngModule = helpers.module;
var inject = helpers.inject;
var sinon = helpers.sinon;
var expect = require('chai').expect;

require('../components/login/scripts/services/loginResource');
require('../components/login/scripts/services/loginService');
require('../components/login/scripts/controller/login-controller');

describe('Login controller', function ()
{
    var scope;
    var controller;
    var loginResource;
    var sandbox;
    var loginService;
    var location;
    beforeEach(ngModule('CMS.login'));

    beforeEach(inject(function ($rootScope, $controller, $injector, $location)
    {
        scope = $rootScope.$new();
        sandbox = sinon.sandbox.create();
        loginResource = $injector.get('loginResource');
        location = $location;
        loginService = $injector.get('loginService');
        controller = $controller('login-controller', {$scope: scope, loginService: loginService, $location: location, loginResource: loginResource});
    }));

    afterEach(function () {
        sandbox.restore();
    });

    describe('login method', function ()
    {

        it('should call loginService and location path on post success', function (done)
        {

            sandbox.spy(loginService, "setUser");
            sandbox.stub(loginResource, "post").callsArgWith(1, {name: "name"});
            sandbox.stub(location, "path");
            scope.login();
            expect(loginResource.post.calledOnce).to.equal(true);
            expect(loginService.setUser.calledOnce).to.equal(true);
            expect(location.path.calledOnce).to.equal(true);
            done();
        });

        it('should call location path on post error', function (done)
        {

            sandbox.spy(loginService, "setUser");
            sandbox.stub(loginResource, "post").callsArgWith(2, {error: "error"});
            sandbox.stub(location, "path");
            scope.login();
            expect(loginResource.post.calledOnce).to.equal(true);
            expect(loginService.setUser.calledOnce).to.equal(false);
            expect(location.path.calledOnce).to.equal(true);
            done();
        });
    });
});