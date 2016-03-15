var Boss = require('./../domain/boss.js');

//Constructor
function BossService(bossCommunicationService, bossRepository)
{
    this.theBoss = {};
    this.bossCommunicationService = bossCommunicationService;
    this.bossRepository = bossRepository;
}

//Public method
BossService.prototype.initializeBoss = function()
{
    var self = this;
    this.bossRepository.getBoss(function (boss)
    {
        self.theBoss = boss;
        self.bossRepository.saveBoth(self.theBoss);
    });
};

BossService.prototype.makeDamage = function(amount, callback)
{
    this.theBoss.receiveDamage(amount);
    callback(this.theBoss);
};

BossService.prototype.reviveBoss = function()
{
    this.theBoss.revive();
    this.bossRepository.saveBoth(this.theBoss);
};

BossService.prototype.getCurrentBoss = function()
{
    return this.theBoss;
};

BossService.prototype.updateBoss = function(currentLife, maximumLife)
{
    this.theBoss.setCurrentLife(currentLife);
    this.theBoss.setMaximumLife(maximumLife);
};

module.exports = BossService;
