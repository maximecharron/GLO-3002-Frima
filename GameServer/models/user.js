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
    currentXP: Number,
    pointNextLevel: Number,
    XPNextLevel: Number,
    level: Number,
    attack: Number,
    stamina: Number,
    hype: Number
},{ strict : false });

userSchema.methods.toDTO = function (withToken) {
    var obj = this.toObject();

    var dto = {
        id: obj._id,
        username : obj.username,
        email: obj.email,
        items: obj.items,
        currentXP: obj.currentXP,
        pointNextLevel: obj.pointNextLevel,
        XPNextLevel: obj.XPNextLevel,
        level: obj.level,
        attack: obj.attack,
        stamina: obj.stamina,
        hype: obj.hype
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
