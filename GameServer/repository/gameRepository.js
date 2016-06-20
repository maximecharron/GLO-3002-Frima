var ComboModel = require('./../models/combo.js');
var GameConfig = require('./../models/gameConfig.js');

//Constructor
function GameRepository() { }

//Public method
GameRepository.prototype.getCombos = function(callBack) {
    ComboModel.findCombos(function(combos){
        callBack(combos);
    });
};

GameRepository.prototype.getGameConfig = function(callBack){
    GameConfig.findGameConfig(function(gameConfig){
        callBack(gameConfig);
    })
};

module.exports = GameRepository;
