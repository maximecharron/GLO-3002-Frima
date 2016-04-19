var ComboModel = require('./../models/combo.js');
var GameBaseStat = require('./../models/gameBaseStat.js');

//Constructor
function GameRepository()
{

}

//Public method
GameRepository.prototype.getCombos = function(callBack) {
    ComboModel.findCombos(function(combos){
        callBack(combos);
    });
};

GameRepository.prototype.getGameBaseStat = function(callBack){
    GameBaseStat.findGameBaseStat(function(gameBaseStat){
        callBack(gameBaseStat);
    })
};

module.exports = GameRepository;
