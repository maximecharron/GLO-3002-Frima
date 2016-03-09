var redisPub = require('redis').createClient(process.env.REDIS_URL);
var redisSub = require('redis').createClient(process.env.REDIS_URL);
var redisSet = require('redis').createClient(process.env.REDIS_URL);

exports.redisSub = redisSub;
exports.redisPub = redisPub;
exports.redisSet = redisSet;