var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var modelHelpers = require('./modelHelpers.js');
var itemSchema = require("./item.js").schema;

var userSchema = new mongoose.Schema({
    username : { type : String, index : { unique : true, }},
    email: { type : String, index : { unique : true, }},
    password : String,
    token : String,
    expiration : Number,
    items : [itemSchema],
    experiencePoints: Number,
    upgradePointsOnLevelComplete: Number,
    requiredExperiencePointsForNextLevel: Number,
    level: Number,
    attackPowerLevel: Number,
    staminaPowerLevel: Number,
    hypePowerLevel: Number
},{ strict : false });

userSchema.methods.toDTO = function (withToken) {
    var obj = this.toObject();

    var dto = {
        id: obj._id,
        username : obj.username,
        email: obj.email,
        items: obj.items,
        experiencePoints: obj.experiencePoints,
        upgradePointsOnLevelComplete: obj.upgradePointsOnLevelComplete,
        requiredExperiencePointsForNextLevel: obj.requiredExperiencePointsForNextLevel,
        level: obj.level,
        attackPowerLevel: obj.hypePowerLevel,
        staminaPowerLevel: obj.staminaPowerLevel,
        hypePowerLevel: obj.hypePowerLevel
    };

    if(withToken){
        dto.token = obj.token;
    }

    return dto;
};

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
userSchema.methods.isValidPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.method('toJSON', modelHelpers.toJSON);

var User = mongoose.model('User', userSchema);

exports.schema = userSchema;
exports.model = User;
