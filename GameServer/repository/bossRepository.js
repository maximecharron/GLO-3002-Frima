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
        if(object)
        {
            var boss = new Boss(serverName, object.bossName, object.currentBossLife, object.maximumBossLife, object.status);
            callBack(boss);
        }
        else
        {
            DbBoss.findBoss(serverName, function(bossModel)
            {
                if(bossModel)
                {
                    var boss = new Boss(serverName, bossModel.bossName, bossModel.currentBossLife, bossModel.maximumBossLife, bossModel.status);
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
    var boss = new Boss(hostname, bossConfig.bossName, bossConfig.currentLife, bossConfig.maximumBossLife, bossConfig.status );
    callBack(boss);
}

module.exports = BossRepository;
