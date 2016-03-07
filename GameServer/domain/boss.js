var redisPub = require('./../services/redisService.js').redisPub;
var redisSub = require('./../services/redisService.js').redisSub;
var redisSet = require('./../services/redisService.js').redisSet;
var STATUS = Object.freeze({ALIVE: "ALIVE", DEAD: "DEAD"});

//Constructor
function Boss(bossName, currentBossLife, constantBossLife, status)
{
    //Private
    this.bossName = bossName;
    this.currentBossLife = currentBossLife;
    this.constantBossLife = constantBossLife;
    this.status = status;
    redisSub.subscribe(bossName);
}

redisSub.on('message', function(channel, message){
    if(channel == this.bossName)
    {
        var bossMessage = JSON.parse(message);

        this.currentBossLife = bossMessage.currentBossLife;
        this.constantBossLife = bossMessage.constantBossLife;
        this.status = bossMessage.status;
    }
})

//Public method
Boss.prototype.toJson = function()
{
    var bossJson =
    {
        bossName: this.bossName,
        currentBossLife: this.currentBossLife,
        constantBossLife: this.constantBossLife,
        status: this.status
    }

    return bossJson;
}

Boss.prototype.toString = function()
{
    return JSON.stringify(
        {
            "bossName" : this.bossName,
            "constantBossLife": this.constantBossLife,
            "currentBossLife": this.currentBossLife,
            "status": this.status
        });
}

Boss.prototype.receiveDamage = function(amountDamage)
{
    var self = this;
    if (this.currentBossLife > 0)
    {
        this.currentBossLife = this.currentBossLife - amountDamage;
    }
    if(this.currentBossLife <= 0)
    {
        status = STATUS.DEAD;
        redisPub.publish(this.bossName, self.toString());
    }
    redisSet.hmset(this.bossName, {'currentBossLife': this.currentBossLife});
    redisPub.publish(this.bossName, self.toString());
}

Boss.prototype.getLife = function()
{
    return this.currentBossLife;
}

Boss.prototype.getConstantLife = function()
{
    return this.constantBossLife;
}

Boss.prototype.getStatus = function()
{
    return this.status;
}

Boss.prototype.getName = function()
{
    return this.bossName;
}

module.exports = Boss;
