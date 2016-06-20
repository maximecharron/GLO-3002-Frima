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
    this.quantity = 1;
}


//Public method
Consumable.prototype.toJson = function()
{
    var consumable =
    {
        type: parseInt(this.type),
        subType: parseInt(this.subType),
        name: this.name,
        staminaRegeneration: parseInt(this.staminaRegeneration),
        hypeGeneration: parseInt(this.hypeGeneration),
        effectDuration: parseInt(this.effectDuration),
        quantity: this.quantity
    };
    return consumable;
};

Consumable.prototype.toString = function()
{
    return JSON.stringify(
        {
            type: this.type,
            subType: this.subType,
            name: this.name,
            staminaRegeneration: this.staminaRegeneration,
            hypeGeneration: this.hypeGeneration,
            effectDuration: this.effectDuration,
            quantity: this.quantity
        });
};

module.exports = Consumable;
