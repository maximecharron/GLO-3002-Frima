var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var modelHelpers = require('./modelHelpers.js');

var userSchema = new mongoose.Schema();
userSchema.add({
    username : {type: String, index: {unique: true, }},
    email: {type: String, index: {unique: true, }},
    password: String,
    token: String,
    expiration: Number
});

userSchema.methods.toDTO = function (following, withToken) {
    var obj = this.toObject();

    var dto = {
        id: obj._id,
        username : obj.username,
        email: obj.email
    };

    if(withToken){
        dto.token = obj.token;
    }

    return dto;
};

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.method('toJSON', modelHelpers.toJSON);

var User = mongoose.model('User', userSchema);

exports.schema = userSchema;
exports.model = User;
