//Constructor
function Consumable(type, subType, name, staminaRegeneration, hypeGeneration, effectDuration)
{
    //Private
    this.type = type;
    this.subType = subType;
    this.name = name;
    this.staminaRegeneration = staminaRegeneration;
    this.hypeGeneration = hypeGeneration;
    this.effectDuration = effectDuration;
}


//Public method
Consumable.prototype.toJson = function()
{
    var consumable =
    {
        type: this.type,
        subType: this.subType,
        name: this.name,
        staminaRegeneration: this.staminaRegeneration,
        hypeGeneration: this.hypeGeneration,
        effectDuration: this.effectDuration
    };
    return consumable;
};

Consumable.prototype.toString = function()
{
    return JSON.stringify(
        {
            type: this.type,
            name: this.name,
            subType: this.subType,
            staminaRegeneration: this.staminaRegeneration,
            hypeGeneration: this.hypeGeneration,
            effectDuration: this.effectDuration
        });
};

module.exports = Consumable;
