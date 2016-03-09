var Boss = require('./../domain/boss.js');
var BossCommunicationService = require('./../services/bossCommunicationService.js').BossCommunicationService;
var BossRepository = require('./../repository/bossRepository.js').BossRepository;
var RedisCommunicationService = require('./../services/redisCommunicationService.js').RedisCommunicationService;

function BossService()
{
    this.theBoss;
}

setInterval(function () {
    BossCommunicationService.broadcastBossInformation(this.theBoss);
    }, 100
);

setInterval(function () {
        BossRepository.saveBossBd(this.theBoss);
    }, 9000
);

BossService.prototype.initializeBoss = function()
{
    BossRepository.getBoss(function (boss)
    {
        this.theBoss = boss;
        console.log("theBoss: ", this.theBoss);
        BossRepository.saveBoth(this.theBoss);
        RedisCommunicationService.subscribeServerCmsName(this.theBoss.getServerName()+'CMS');
    });
}

BossService.prototype.makeDamage = function(amount)
{
    this.theBoss.receiveDamage(amount);
    if(this.theBoss.getStatus() == STATUS.DEAD)
    {
        RedisCommunicationService.publishBossDead(this.theBoss.toString());
    }
    else
    {
        RedisCommunicationService.setBossCurrentLife(theBoss.getCurrentLife());
    }
}

BossService.prototype.reviveBoss = function()
{
    this.theBoss.revive();
    BossRepository.saveBoth(this.theBoss);
}

BossService.prototype.getCurrentBoss = function()
{
    return this.theBoss;
}

BossService.prototype.updateBoss = function(currentLife, constantLife)
{
    this.theBoss.setCurrentLife(currentLife);
    this.theBoss.setConstantLife(constantLife);
    //BossRepository.saveBoth(this.theBoss); //Voir si utilisé ailleurs
}

module.exports = BossService;
