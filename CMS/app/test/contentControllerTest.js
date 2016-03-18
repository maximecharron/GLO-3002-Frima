var helpers = require('./../test/test-helpers');
var ngModule = helpers.module;
var inject = helpers.inject;
var sinon = helpers.sinon;
var expect = require('chai').expect;
require('../components/content/scripts/services/contentResource');
require('../components/content/scripts/controller/content-controller');

const BOSS = {
    bossName: "bossName",
    serverName: "serverName",
    maximumBossLife: 1000,
    currentBossLife: 1000,
    status: "0"
};
const UPDATED_BOSS = {
    bossName: "updatedBossName",
    serverName: "updatedServerName",
    maximumBossLife: 1000,
    currentBossLife: 1000,
    status: "0"
}
const BOSS_STRING = '{"bossName": "bossName", "serverName": "serverName", "maximumBossLife": 1000, "currentBossLife": 1000, "status": "0"}';
const CONSTANT_TYPE = '{"type": "constant"}';
const CURRENT_TYPE = '{"type": "current"}';

describe('Content controller', function ()
{
    var scope;
    var controller;
    var contentResource;
    var sandbox;
    beforeEach(ngModule('CMS.content'));

    beforeEach(inject(function ($rootScope, $controller, $injector)
    {
        scope = $rootScope.$new();
        sandbox = sinon.sandbox.create();
        contentResource = $injector.get('contentResource');
        controller = $controller('content-controller', {$scope: scope, contentResource: contentResource});
    }));

    afterEach(function () {
        sandbox.restore();
    });

    it('should have an initial updateSuccess state', function(){
        expect(scope.updateSuccess).to.equal(false);
    });

    it('should have an initial updateError state', function(){
        expect(scope.updateError).to.equal(false);
    });

    it('should have an initial updateTypes state', function(){
        expect(scope.updateTypes).to.be.ok;
    });

    it('should have an initial selectedBoss state', function(){
        expect(scope.selectedBoss).to.be.undefined;
    });

    it('should have an initial bosses state', function(){
        expect(scope.bosses).to.be.undefined;
    });

    it('should have an initial selectedUpdateType state', function(){
        expect(scope.selectedUpdateType).to.be.undefined;
    });

    describe('typeChanged method', function ()
    {
        it('should call constantBoss if type is constant', function (done)
        {
            sandbox.spy(contentResource, "getConstantBosses");
            scope.typeChanged(CONSTANT_TYPE);
            expect(contentResource.getConstantBosses.calledOnce).to.equal(true);
            done();
        });

        it('should call currentBoss if type is current', function (done)
        {
            sandbox.spy(contentResource, "getCurrentBosses");
            scope.typeChanged(CURRENT_TYPE);
            expect(contentResource.getCurrentBosses.calledOnce).to.equal(true);
            done();
        });

        it('should set bosses to currentBosses if current', function (done)
        {
            sandbox.stub(contentResource, "getCurrentBosses").callsArgWith(0, BOSS);
            scope.typeChanged(CURRENT_TYPE);
            expect(contentResource.getCurrentBosses.calledOnce).to.equal(true);
            expect(scope.bosses).to.equal(BOSS);
            done();
        });

        it('should set bosses to constantBosses if constant', function (done)
        {
            sandbox.stub(contentResource, "getConstantBosses").callsArgWith(0, BOSS);
            scope.typeChanged(CONSTANT_TYPE);
            expect(contentResource.getConstantBosses.calledOnce).to.equal(true);
            expect(scope.bosses).to.equal(BOSS);
            done();
        });
    });

    describe('changed method', function ()
    {
        it('should set selectedBoss if it is null', function (done)
        {
            expect(scope.selectedBoss).to.be.undefined;
            scope.bossChanged(BOSS_STRING);
            expect(scope.selectedBoss.bossName).to.equal(BOSS.bossName);
            done();
        });

        it('should update selectedBoss if it is not null', function (done)
        {
            scope.selectedBoss = {"bossName": "blop"};
            expect(scope.selectedBoss).to.not.be.undefined;
            scope.bossChanged(BOSS_STRING);
            expect(scope.selectedBoss.bossName).to.equal(BOSS.bossName);
            done();
        });
    });

    describe('updateBoss method', function ()
    {
        it('should put updateSuccess and updateError to false when starting update', function (done)
        {
            sandbox.stub(contentResource, "updateBoss", function(boss, callbackSuccess, callbackError){
                /*Empty stub on purpose*/
            });
            scope.updateSuccess = true;
            scope.updateError = true;
            scope.updateBoss(UPDATED_BOSS);
            expect(scope.updateError).to.equal(false);
            expect(scope.updateSuccess).to.equal(false);
            done();
        });
        it('should call updateBoss on contentResource', function (done)
        {
            sandbox.spy(contentResource, "updateBoss");
            scope.updateBoss(UPDATED_BOSS);
            expect(contentResource.updateBoss.calledOnce).to.equal(true);
            done();
        });

        it('should update selectedBoss and updateSuccess if successful', function (done)
        {
            scope.selectedBoss = BOSS;
            sandbox.stub(contentResource, "updateBoss").callsArgWith(1, UPDATED_BOSS);
            scope.updateBoss(UPDATED_BOSS);
            expect(contentResource.updateBoss.calledOnce).to.equal(true);
            expect(scope.selectedBoss.bossName).to.equal(UPDATED_BOSS.bossName);
            expect(scope.updateSuccess).to.equal(true);
            expect(scope.updateError).to.equal(false);
            done();
        });

        it('should  not update selectedBoss and update updateError if not successful', function (done)
        {
            scope.selectedBoss = BOSS;
            sandbox.stub(contentResource, "updateBoss").callsArgWith(2, UPDATED_BOSS);
            scope.updateBoss(UPDATED_BOSS);
            expect(contentResource.updateBoss.calledOnce).to.equal(true);
            expect(scope.selectedBoss.bossName).to.equal(BOSS.bossName);
            expect(scope.updateError).to.equal(true);
            expect(scope.updateSuccess).to.equal(false);
            done();
        });
    });
});