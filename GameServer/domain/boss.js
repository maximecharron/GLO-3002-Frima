//Constructor
function Boss(hostname, bossName, currentBossLife, maximumBossLife, status)
{
    //Private
    this.serverName = hostname;
    this.bossName = bossName;
    this.currentBossLife = currentBossLife;
    this.maximumBossLife = maximumBossLife;
    this.status = status;

}

//Public method
Boss.prototype.toJson = function()
{
    var bossJson =
    {
        bossName: this.bossName,
        currentBossLife: this.currentBossLife,
        maximumBossLife: this.maximumBossLife,
        status: this.status
    };
    return bossJson;
};

Boss.prototype.toString = function()
{
    return JSON.stringify(
        {
            "bossName" : this.bossName,
            "currentBossLife": this.currentBossLife,
            "maximumBossLife": this.maximumBossLife,
            "status": this.status
        });
};

Boss.prototype.receiveDamage = function(damageAmount)
{
    if (this.currentBossLife > 0)
    {
        this.currentBossLife = this.currentBossLife - damageAmount;
    }

    if(this.currentBossLife <= 0)
    {
        this.status = STATUS.DEAD;
        this.currentBossLife = 0;
    }
};

Boss.prototype.getLife = function()
{
    return this.currentBossLife;
};

Boss.prototype.getMaximumLife = function()
{
    return this.maximumBossLife;
};

Boss.prototype.getStatus = function()
{
    return this.status;
};

Boss.prototype.setMaximumLife = function(maximumBossLife)
{
    this.maximumBossLife = maximumBossLife;
};

Boss.prototype.setCurrentLife = function(currentLife)
{
    this.currentBossLife = currentLife;
};

Boss.prototype.revive = function()
{
    this.currentBossLife = this.maximumBossLife;
    this.status = STATUS.ALIVE;
};

module.exports = Boss;

