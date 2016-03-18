var helpers = require('./../test/test-helpers');
var ngModule = helpers.module;
var inject = helpers.inject;
var expect = require('chai').expect;
require('../bower_components/angular-route');
require('../bower_components/angular-resource');
require('../components/content/scripts/services/contentResource');

const BOSSES_CONSTANT = [{
    bossName: "bossNameConstant",
    serverName: "serverNameConstant",
    maximumBossLife: 1000,
    currentBossLife: 1000,
    status: "0"
}];

const BOSSES = [{
    bossName: "bossName",
    serverName: "serverName",
    maximumBossLife: 1000,
    currentBossLife: 1000,
    status: "0"
}];
const BOSS = {
    bossName: "bossName",
    serverName: "serverName",
    maximumBossLife: 1000,
    currentBossLife: 1000,
    status: "0"
};
describe('Content service', function() {
    beforeEach(ngModule('CMS.content'));

    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');

        $httpBackend.when('GET', 'https://frima-cms-server.herokuapp.com/bossesConstant').respond(BOSSES_CONSTANT);
        $httpBackend.when('GET', 'https://frima-cms-server.herokuapp.com/bosses').respond(BOSSES);
        $httpBackend.when('POST','https://frima-cms-server.herokuapp.com/update').respond(BOSS);

        this.$httpBackend = $httpBackend;
    }));

    afterEach(function() {
        this.$httpBackend.verifyNoOutstandingExpectation();
        this.$httpBackend.verifyNoOutstandingRequest();
    });

    describe('getConstantBosses method', function() {
        it('should return a list of bosses constant', function(done) {
            inject(function(contentResource) {
                contentResource.getConstantBosses(function(bosses) {
                    expect(bosses[0].bossName).to.equal(BOSSES_CONSTANT[0].bossName);
                    done();
                });

                $httpBackend.flush();
            })
        });
    });

    describe('getCurrentBosses method', function() {
        it('should return a list of bosses constant', function(done) {
            inject(function(contentResource) {
                contentResource.getCurrentBosses(function(bosses) {
                    expect(bosses[0].bossName).to.equal(BOSSES[0].bossName);
                    done();
                });

                $httpBackend.flush();
            })
        });
    });

    describe('updateBoss method', function() {
        it('should return updated boss', function(done) {
            inject(function(contentResource) {
                contentResource.updateBoss(function(boss) {
                    expect(boss.bossName).to.equal(BOSS.bossName);
                    done();
                });

                $httpBackend.flush();
            })
        });
    });
});