var self;

//Constructor
function GameService(gameRepository, lootService, userService)
{
    this.gameConfig = {};
    this.combos = {};
    this.gameRepository = gameRepository;
    this.lootService = lootService;
    this.userService = userService;

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
    this.gameRepository.getGameConfig(function(gameConfig){
        self.gameConfig = gameConfig;
        if(gameConfig)
        {
            if(gameConfig.probabilityLoot) {
                self.lootService.initializeItemsDropRate(gameConfig.probabilityLoot);
            }
            if(gameConfig.experiencePerLevel != null && gameConfig.upgradePointsPerLevel != null && gameConfig.maximumLevel != null) {
                self.userService.setExperienceInformation(gameConfig.experiencePerLevel, gameConfig.upgradePointsPerLevel, gameConfig.maximumLevel);
            }
            if(callBack) {
                callBack(gameConfig);
            }
        }else{
            console.log("Problem with gameService initializeGameBaseStat: ", gameConfig);
        }
    })
};

GameService.prototype.getGameConfig = function(){
  return this.gameConfig;
};

GameService.prototype.getCombos = function(){
    return this.combos;
};

GameService.prototype.getUserGameConfig = function(){
    var gameUserConfig = {};

    try{
        gameUserConfig = {
            baseAttackDamage: this.gameConfig.baseAttackDamage,
            baseExperienceIncreaseOnHit: this.gameConfig.baseExperienceIncreaseOnHit,
            hypeAttackDamage: this.gameConfig.hypeAttackDamage,
            maximumLevel: this.gameConfig.maximumLevel
        };

        return gameUserConfig;
    }catch(err){
        console.log("baseAttackDamage, baseExperienceIncreaseOnHit, hypeAttackDamage, maximumLevel for gameConfig can't be null: ", gameUserConfig);
        console.log("Error: ", err);
    }
};

module.exports = GameService;