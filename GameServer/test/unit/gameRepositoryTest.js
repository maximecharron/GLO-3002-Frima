
var proxyquire = require('proxyquire');
var chai = require('chai');
var spies = require('chai-spies');
chai.use(spies);

var expect = chai.expect;
var should = chai.should();

var combos = "COMBOS";
var gameBaseStat = "GAME_BASE_STAT";
var comboModelStub = {};
var gameBaseStatStub = {};

//Stubs
comboModelStub.findCombos = function(callBack) { callBack(combos)};
gameBaseStatStub.findGameBaseStat = function(callBack) { callBack(gameBaseStat)};

var GameRepository = proxyquire('./../../repository/gameRepository.js', {'./../models/combo.js': comboModelStub, './../models/gameBaseStat.js': gameBaseStatStub});

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

    describe("getGameBaseStat", function()
    {
        it("should call GameBaseStatModel and callBack gameBaseStat", function()
        {
            //Arrange
            var gameRepository = new GameRepository();
            var modelSpy = chai.spy.on(gameBaseStatStub, 'findGameBaseStat');

            //Act
            var result;
            gameRepository.getGameBaseStat(function(baseStat){
                result = baseStat;
            });

            //Assert
            expect(modelSpy).to.have.been.called.once;
            expect(gameBaseStat).to.equal(result);
        });
    });
});
