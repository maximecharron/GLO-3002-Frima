var mongoose = require('mongoose');
var modelHelpers = require('./modelHelpers.js');

var pointSchema = new mongoose.Schema({x: Number, y: Number},{ strict : false });

pointSchema.method('toJSON', modelHelpers.toJSON);

var Point = mongoose.model('Point', pointSchema);

exports.schema = pointSchema;
exports.model = Point;