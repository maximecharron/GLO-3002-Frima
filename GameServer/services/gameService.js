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

GameService.prototype.initializeCombo = function(callBack) {
    this.gameRepository.getCombos(function(combos){
        self.combos = combos;
        if(callBack)
        {
            callBack();
        }
    })
};

GameService.prototype.initializeGameBaseStat = function(callBack){
    this.gameRepository.getGameBaseStat(function(gameBaseStat){
        self.gameBaseStat = gameBaseStat;
        if(callBack)
        {
            callBack();
        }
    })
};

GameService.prototype.getGameBaseStat = function(){
  return this.gameBaseStat;
};

GameService.prototype.getCombos = function(){
    return this.combos;
};

module.exports = GameService;