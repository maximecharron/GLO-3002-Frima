var DbBoss = require('./../models/boss.js');
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

    this.redisCommunicationService.findBoss(serverName, function(err, object)
    {
        //console.log("redis: ", serverName);
        if(object)
        {
            //console.log("inside redis: ", serverName);
            var boss = new Boss(serverName, object.bossName, object.currentBossLife, object.constantBossLife, object.status);
            callBack(boss);
        }
        else
        {
            DbBoss.findBoss(serverName, function(bossModel)
            {
                //console.log("DbBoss: ", serverName);
                if(bossModel)
                {
                    //console.log("inside dbBoss: ", serverName);
                    var boss = new Boss(serverName, bossModel.bossName, bossModel.currentBossLife, bossModel.constantBossLife, bossModel.status);
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
    self.saveBossBd(boss);
};

BossRepository.prototype.saveBossRedis = function(boss)
{
    this.redisCommunicationService.setBoss(boss);
};

BossRepository.prototype.saveBossBd = function (boss)
{
    DbBoss.backupBoss(boss);
};

//Private method
function getConfigBoss(callBack)
{
    var boss = new Boss(hostname, bossConfig.bossName, bossConfig.currentLife, bossConfig.constantLife, bossConfig.status );
    callBack(boss);
}

module.exports = BossRepository;
