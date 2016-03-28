//Constructor
function ProteinShake()
{
    //Private
    this.type = "consumable";
    this.name = "ProteinShake";
    this.modifiedStats = { stam:10, dex:0 };
}


//Public method
ProteinShake.prototype.toJson = function()
{
    var proteinShakeJson =
    {
        type: this.type,
        name: this.name,
        modifiedStats: this.modifiedStats,
    };
    return proteinShakeJson;
};

ProteinShake.prototype.toString = function()
{
    return JSON.stringify(
        {
            type: this.type,
            name: this.name,
            modifiedStats: this.modifiedStats,
        });
};

module.exports = ProteinShake;