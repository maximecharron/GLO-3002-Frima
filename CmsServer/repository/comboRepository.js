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

exports.removeCombo = function (id, callback)
{
    Combo.findById(id, function (err, combo)
        {
            if (!err)
            {
                if (combo)
                {
                    combo.remove();
                    callback(null, true);
                }
                else
                {
                    callback(null, false);
                }
            }
            else
            {
                callback(false);
            }
        }
    );
};

exports.updateCombo = function (comboToUpdate, callback)
{
    this.findCombo(comboToUpdate.name, function (combo)
    {
        combo.name = comboToUpdate.name;
        combo.triggerFrequency = comboToUpdate.triggerFrequency;
        combo.bonusMultiplier = comboToUpdate.bonusMultiplier;
        combo.triggerZone = comboToUpdate.triggerZone;
        combo.maxFirstHitWaitTime = comboToUpdate.maxFirstHitWaitTime;
        combo.maxWaitTimeBetweenHits = comboToUpdate.maxWaitTimeBetweenHits;
        combo.hitZones = comboToUpdate.hitZones;

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

exports.newCombo = function (comboToCreate, callback)
{
    var combo = new Combo();
    combo.name = comboToCreate.name;
    combo.triggerFrequency = comboToCreate.triggerFrequency;
    combo.bonusMultiplier = comboToCreate.bonusMultiplier;
    combo.triggerZone = comboToCreate.triggerZone;
    combo.maxFirstHitWaitTime = comboToCreate.maxFirstHitWaitTime;
    combo.maxWaitTimeBetweenHits = comboToCreate.maxWaitTimeBetweenHits;
    combo.hitZones = comboToCreate.hitZones;
    combo.save(function (err, combo)
    {
        if (err)
        {
            console.log(err);
        }
        callback(combo);
    });
};
