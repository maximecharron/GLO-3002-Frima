//Constructor
function AdrenalineShot()
{
    //Private
    this.type = "consumable";
    this.name = "AdrenalineShot";
    this.modifiedStats = { stamina : 0, hype : 10 };
}


//Public method
AdrenalineShot.prototype.toJson = function()
{
    var adrenalineJson =
    {
        type: this.type,
        name: this.name,
        modifiedStats: this.modifiedStats,
    };
    return adrenalineJson;
};

AdrenalineShot.prototype.toString = function()
{
    return JSON.stringify(
        {
            type: this.type,
            name: this.name,
            modifiedStats: this.modifiedStats,
        });
};

module.exports = AdrenalineShot;