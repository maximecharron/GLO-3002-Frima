
//Constructor
function Boss(hostname, bossName, currentBossLife, constantBossLife, status)
{
    //Private
    this.serverName = hostname;
    this.bossName = bossName;
    this.currentBossLife = currentBossLife;
    this.constantBossLife = constantBossLife;
    this.status = status;

}

//Public method
Boss.prototype.toJson = function()
{
    var bossJson =
    {
        bossName: this.bossName,
        currentBossLife: this.currentBossLife,
        constantBossLife: this.constantBossLife,
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
            "constantBossLife": this.constantBossLife,
            "status": this.status
        });
};

Boss.prototype.receiveDamage = function(amountDamage)
{
    if (this.currentBossLife > 0)
    {
        this.currentBossLife = this.currentBossLife - amountDamage;
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

Boss.prototype.getConstantLife = function()
{
    return this.constantBossLife;
};

Boss.prototype.getStatus = function()
{
    return this.status;
};

Boss.prototype.setConstantLife = function(constantLife)
{
    this.constantBossLife = constantLife;
};

Boss.prototype.setCurrentLife = function(currentLife)
{
    this.currentBossLife = currentLife;
};

Boss.prototype.revive = function()
{
    //console.log("Boss is being revived");
    this.currentBossLife = this.constantBossLife;
    this.status = STATUS.ALIVE;
};

module.exports = Boss;
