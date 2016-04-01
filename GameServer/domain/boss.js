//Constructor
function Boss(hostname, bossName, currentBossLife, maximumBossLife, status, creationDate)
{
    //Private
    this.serverName = hostname;
    this.bossName = bossName;
    this.currentBossLife = currentBossLife;
    this.maximumBossLife = maximumBossLife;
    this.status = status;
    this.creationDate = creationDate;

}

//Public method
Boss.prototype.toJson = function()
{
    var bossJson =
    {
        bossName: this.bossName,
        currentBossLife: this.currentBossLife,
        maximumBossLife: this.maximumBossLife,
        status: this.status,
        startedDate : this.creationDate
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
            "status": this.status,
            "creationDate" : this.creationDate
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
    this.creationDate = new Date().setSeconds(0,0);
};

Boss.prototype.setStartedDate = function(date)
{
    this.creationDate = date;
};

Boss.prototype.getStartedDate = function()
{
    return this.creationDate;
};

module.exports = Boss;

