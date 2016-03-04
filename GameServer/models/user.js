var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var modelHelpers = require('./modelHelpers.js');

var userSchema = new mongoose.Schema();
userSchema.add({
    username : String,
    email: String,
    password: String,
    token: String,
    expiration: Number,
    picture: String,
    google: String,
    facebook: String
});

userSchema.methods.toDTO = function (following, withToken) {
    var obj = this.toObject();

    var dto = {
        username : obj.username,
        email: obj.email,
        picture: obj.picture,
        google: obj.google,
        facebook : obj.facebook
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
