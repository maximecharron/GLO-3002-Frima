var Combo = require('./../models/combo.js').model;

exports.findAllCombos = function (callback)
{
    Combo.find({}, function (err, result)
    {
        if (result && result.length > 0)
        {
            callback(result);
        } else
        {
            callback(null);
        }
    });
};

exports.findCombo = function (name, callback)
{
    Combo.findOne({"name": name}, function (err, result)
    {
        if (result)
        {
            callback(result);
        } else
        {
            callback(null);
        }
    });
};

exports.removeCombo = function (name, callback)
{
    Combo.remove({"name": name}, function (err)
    {
        if (!err)
        {
            callback();
        } else
        {
            callback();
        }
    });
};

exports.updateCombo = function (comboToUpdate, callback)
{
    this.findCombo(comboToUpdate.name, function (combo)
    {
        combo.name = comboToUpdate.name;
        combo.triggerFrequency = comboToUpdate.triggerFrequency;
        combo.bonusMultiplier = comboToUpdate.bonusMultiplier;
        combo.triggerZone = JSON.parse(comboToUpdate.triggerZone);
        combo.maxFirstHitWaitTime = comboToUpdate.maxFirstHitWaitTime;
        combo.maxWaitTimeBetweenHits = comboToUpdate.maxWaitTimeBetweenHits;
        combo.hitZones = JSON.parse(comboToUpdate.hitZones);
        combo.save(function (err, combo)
        {
            if (err)
            {
                console.log(err);
            }
            callback(combo);
        });
    });
};
