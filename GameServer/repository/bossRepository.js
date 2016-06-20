var BossModel = require('./../models/boss.js');
var hostname = process.env.SERVER_NAME || require('os').hostname();
var Boss = require('./../domain/boss.js');
var bossConfig = require('./../config/bossConfig.js');

//Constructor
function BossRepository(redisCommunicationService)
{
    this.redisCommunicationService = redisCommunicationService;
}

//Public method
BossRepository.prototype.getBoss = function(callBack, constant)
{
    var self = this;
    var serverName = hostname;
    if(constant)
    {
        serverName += "Constant";
    }

    //Méthode permettant de créer une redondance pour s'assurer qu'il y est toujours un boss.
    //On regarde dans redis, mongo si le boss est présent.
    //Sinon on regarde dans redis, mongo pour une constante de boss.
    //Finalement, on va chercher la config qui elle est hardcodé dans un fichier de config.
    this.redisCommunicationService.findBoss(serverName, function(error, object)
    {
        if(object)
        {
            var boss = new Boss(serverName, object.bossName, object.currentBossLife, object.maximumBossLife, object.status, object.creationDate);
            callBack(boss);
        }
        else if (error){
            console.log(error);
        }
        else
        {
            BossModel.findBoss(serverName, function(bossModel)
            {
                if(bossModel)
                {
                    var boss = new Boss(serverName, bossModel.bossName, bossModel.currentBossLife, bossModel.maximumBossLife, bossModel.status, bossModel.creationDate);
                    callBack(boss);
                }
                else
                {
                    if(constant)
                    {
                        getConfigBoss(function(boss)
                        {
                            callBack(boss);
                        });
                    }
                    else
                    {
                        self.getBoss(callBack, true);
                    }
                }
            });
        }
    });
};

BossRepository.prototype.saveBoth = function(boss)
{
    var self = this;
    self.saveBossRedis(boss);
    self.saveBossToMongo(boss);

    this.redisCommunicationService.setCurrentLife(boss.getLife());
};

BossRepository.prototype.saveBossRedis = function(boss)
{
    this.redisCommunicationService.setBoss(boss);
};

BossRepository.prototype.saveBossToMongo = function (boss)
{
    BossModel.backupBoss(boss);
};

//Private method
function getConfigBoss(callBack)
{
    var boss = new Boss(hostname, bossConfig.bossName, bossConfig.currentLife, bossConfig.maximumBossLife, bossConfig.status, new Date().setSeconds(0,0));
    callBack(boss);
}

module.exports = BossRepository;
