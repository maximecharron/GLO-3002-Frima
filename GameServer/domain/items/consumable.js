//Constructor
function Consumable(type, name, staminaRegeneration, hypeGeneration)
{
    //Private
    this.type = type;
    this.name = name;
    this.staminaRegeneration = staminaRegeneration;
    this.hypeGeneration = hypeGeneration;
}


//Public method
Consumable.prototype.toJson = function()
{
    var adrenalineJson =
    {
        type: this.type,
        name: this.name,
        staminaRegeneration: this.staminaRegeneration,
        hypeGeneration: this.hypeGeneration
    };
    return adrenalineJson;
};

Consumable.prototype.toString = function()
{
    return JSON.stringify(
        {
            type: this.type,
            name: this.name,
            staminaRegeneration: this.staminaRegeneration,
            hypeGeneration: this.hypeGeneration
        });
};

module.exports = Consumable;
