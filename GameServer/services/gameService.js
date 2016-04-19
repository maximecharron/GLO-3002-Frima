var self;

//Constructor
function GameService(gameRepository)
{
    this.gameBaseStat = {};
    this.combos = {};
    this.gameRepository = gameRepository;

    self = this;

    this.initializeGameService();

}

//Public method
GameService.prototype.initializeGameService = function(){
    this.initializeCombo();
    this.initializeGameBaseStat();
};

GameService.prototype.initializeCombo = function() {
    this.gameRepository.getCombos(function(combos){
        self.combos = combos;
    })
};

GameService.prototype.initializeGameBaseStat = function(){
    this.gameRepository.getGameBaseStat(function(gameBaseStat){
        self.gameBaseStat = gameBaseStat;
    })
};

GameService.prototype.getGameBaseStat = function(){
  return this.gameBaseStat;
};

GameService.prototype.getCombos = function(){
    return this.combos;
};

module.exports = GameService;