
var proxyquire = require('proxyquire');
var chai = require('chai');
var spies = require('chai-spies');
chai.use(spies);

var expect = chai.expect;
var should = chai.should();

var combos = "COMBOS";
var gameConfig = "GAME_CONFIG_STAT";
var comboModelStub = {};
var gameConfigStub = {};

//Stubs
comboModelStub.findCombos = function(callBack) { callBack(combos)};
gameConfigStub.findGameConfig = function(callBack) { callBack(gameConfig)};

var GameRepository = proxyquire('./../../repository/gameRepository.js', {'./../models/combo.js': comboModelStub, './../models/gameConfig.js': gameConfigStub});

before(function(done){
    done();
});

describe("gameRepository", function ()
{
    beforeEach(function(done)
    {
        done();
    });

    describe("getCombos", function()
    {
        it("should call ComboModel and callBack combos", function()
        {
            //Arrange
            var gameRepository = new GameRepository();
            var modelSpy = chai.spy.on(comboModelStub, 'findCombos');

            //Act
            var result;
            gameRepository.getCombos(function(combos){
                result = combos;
            });

            //Assert
            expect(modelSpy).to.have.been.called.once;
            expect(combos).to.equal(result);
        });
    });

    describe("getGameConfig", function()
    {
        it("should call GameConfigModel and callBack gameConfig", function()
        {
            //Arrange
            var gameRepository = new GameRepository();
            var modelSpy = chai.spy.on(gameConfigStub, 'findGameConfig');

            //Act
            var result;
            gameRepository.getGameConfig(function(baseStat){
                result = baseStat;
            });

            //Assert
            expect(modelSpy).to.have.been.called.once;
            expect(gameConfig).to.equal(result);
        });
    });
});
