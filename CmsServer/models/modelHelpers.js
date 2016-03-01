exports.toJSON = function(){
    var obj = this.toObject();

    obj.id = odj._id;
    delete obj._id;
    delete obj.__v;
    delete obj.password;

    return obj;
}