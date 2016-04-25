//Constructor
function BossService(bossCommunicationService, bossRepository, redisCommunicationService)
{
    this.boss = {};
    this.bossCommunicationService = bossCommunicationService;
    this.bossRepository = bossRepository;
    this.redisCommunicationService = redisCommunicationService;
}

//Public method
BossService.prototype.initializeBoss = function()
{
    var self = this;
    this.bossRepository.getBoss(function (boss)
    {
        self.boss = boss;
        self.bossRepository.saveBoth(self.boss);
    });
};

BossService.prototype.makeDamage = function(amount, callback)
{
    this.redisCommunicationService.decreaseCurrentLife(amount);
    this.boss.receiveDamage(amount);
    callback(this.boss);
};

BossService.prototype.reviveBoss = function()
{
    this.boss.revive();
    this.bossRepository.saveBoth(this.boss);
};

BossService.prototype.getCurrentBoss = function()
{
    return this.boss;
};

BossService.prototype.updateBoss = function(currentLife, maximumLife)
{
    this.boss.setCurrentLife(currentLife);
    this.boss.setMaximumLife(maximumLife);
};

BossService.prototype.updateCurrentLife = function(currentLife)
{
    this.boss.setCurrentLife(currentLife);
};

BossService.prototype.saveBossDataBase = function()
{
    this.bossRepository.saveBossToMongo(this.boss);
};

module.exports = BossService;
