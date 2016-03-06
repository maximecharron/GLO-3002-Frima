var redisPub = require('./../services/redisService.js').redisPub;
var redisSub = require('./../services/redisService.js').redisSub;
var redisSet = require('./../services/redisService.js').redisSet;
var STATUS = Object.freeze({ALIVE: "ALIVE", DEAD: "DEAD"});

var channelToListen;

//Constructor
function Boss(hostname, bossName, currentBossLife, constantBossLife, status)
{
    //Private
    if(!hostname)
    {throw "Hostname is null"}
    if(!bossName)
    {throw "BossName is null"};
    if(!currentBossLife)
    {throw "CurrentBossLife is null"};
    if(!constantBossLife)
    {throw "ConstantBossLife is null"}
    if(!status)
    {throw "Status is null"}
    channelToListen = hostname;
    this.serverName = hostname;
    this.bossName = bossName;
    this.currentBossLife = currentBossLife;
    this.constantBossLife = constantBossLife;
    this.status = status;

    redisSub.subscribe(this.serverName);
}

redisSub.on('message', function(channel, message){

    if(channel == channelToListen)
    {
        try {
            var bossMessage = JSON.parse(message); //JSON.parse() is synchrone!
        } catch (e) {
            return console.error(e);
        }
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
        this.currentBossLife = 0;
        redisPub.publish(this.serverName, self.toString());
    }
    redisSet.hmset(this.serverName, {'currentBossLife': this.currentBossLife});
    redisPub.publish(this.serverName, self.toString());
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
