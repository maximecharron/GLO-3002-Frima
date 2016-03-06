var redisPub = require('./../services/redisService.js').redisPub;
var redisSub = require('./../services/redisService.js').redisSub;
var redisSet = require('./../services/redisService.js').redisSet;
var STATUS = Object.freeze({ALIVE: "ALIVE", DEAD: "DEAD"});

//Constructor
function Boss(bossName, currentBossLife, constantBossLife, status)
{
    //Private
    if(!bossName)
    {throw "BossName is null"};
    if(!currentBossLife)
    {throw "CurrentBossLife is null"};
    if(!constantBossLife)
    {throw "ConstantBossLife is null"}
    if(!status)
    {throw "Status is null"}

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

Boss.prototype.receiveDamage = function(hostname, amountDamage)
{
    var self = this;
    if (this.currentBossLife > 0)
    {
        this.currentBossLife = this.currentBossLife - amountDamage;
    }
    if(this.currentBossLife <= 0)
    {
        status = STATUS.DEAD;
        redisPub.publish(hostname, self.toString());
    }
    redisSet.hmset(hostname, {'currentBossLife': this.currentBossLife});
    redisPub.publish(hostname, self.toString());
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

Boss.prototype.revive = function(){
    this.currentBossLife = this.constantBossLife;
    this.status = STATUS.ALIVE;
};

module.exports = Boss;
