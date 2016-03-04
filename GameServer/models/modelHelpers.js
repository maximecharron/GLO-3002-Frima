exports.toJSON = function() {
    var obj = this.toObject();
    delete obj._id;
    delete obj.__v;
    delete obj.password;

    return obj;
};