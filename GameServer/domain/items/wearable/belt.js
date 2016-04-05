//Constructor
function Belt()
{
    //Private
    this.type = "wearable";
    this.name = "belt";
    this.bodySlot = "waist";
    this.modifiedStats = { stam:10, dex:10};
}


//Public method
Belt.prototype.toJson = function()
{
    var beltJson =
    {
        type: this.type,
        name: this.name,
        bodySlot: this.bodySlot,
        modifiedStats: this.modifiedStats
    };
    return beltJson;
};

Belt.prototype.toString = function()
{
    return JSON.stringify(
        {
            type: this.type,
            name: this.name,
            bodySlot: this.bodySlot,
            modifiedStats: this.modifiedStats
        });
};

module.exports = Belt;