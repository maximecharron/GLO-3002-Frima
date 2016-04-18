//Constructor
function GameService()
{
    this.gameBaseStat = {};
    this.combo = {};
    this.initializeGameService();
}

//Public method
GameService.prototype.initializeGameService = function(){
    this.initializeCombo();
    this.initializeGameBaseStat();
};

GameService.prototype.initializeCombo = function() {

};

GameService.prototype.initializeGameBaseStat = function(){

};

module.exports = GameService;