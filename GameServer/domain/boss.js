var redisPub = require('./../services/redisService.js').redisPub;
var redisSub = require('./../services/redisService.js').redisSub;
var redisSet = require('./../services/redisService.js').redisSet;
var STATUS = Object.freeze({ALIVE: "0", DEAD: "1"});

var channelListen;

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
    channelListen = hostname+'CMS';
    this.serverName = hostname;
    this.bossName = bossName;
    this.currentBossLife = currentBossLife;
    this.constantBossLife = constantBossLife;
    this.status = status;

    redisSub.subscribe(channelListen);
}
/*
redisSub.on('message', function(channel, message){
    console.log("channel: ", channel);
    if(channel == channelListen)
    {
        var self = this;
        var bossMessage;
        console.log("Message is: ", message);
        try {
            bossMessage = JSON.parse(message);
            this.currentBossLife = bossMessage.currentBossLife;
            console.log("Boss life (boss):", this.currentBossLife);
            this.constantBossLife = bossMessage.constantBossLife;
            redisPub.publish(this.serverName, self.toString());
        } catch (e){
            console.log(e);
        }
    }

})
*/
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
        this.status = STATUS.DEAD;
        this.currentBossLife = 0;
        redisPub.publish("bossDead", self.toString());
    }
    redisSet.hmset(this.serverName, {'currentBossLife': this.currentBossLife});
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

Boss.prototype.getServerName = function(){
    return this.serverName;
};

Boss.prototype.setConstantLife = function(constantLife){
    this.constantBossLife = constantLife;
}

Boss.prototype.setCurrentLife = function(currentLife){
    this.currentBossLife = currentLife;
}

Boss.prototype.revive = function(){
    console.log("Boss is being revived");
    this.currentBossLife = this.constantBossLife;
    this.status = STATUS.ALIVE;
    redisSet.hmset(this.serverName, {'currentBossLife': this.currentBossLife});
};

module.exports = Boss;
