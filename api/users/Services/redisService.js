/**
 * declaring modules
 */
var redis = require('redis');
var redisClient = redis.createClient();

/**
 * setting/generating otp in redis
 */
exports.setOTP=function(key){
  var otp = Math.floor((Math.random() * 10000)) + "";
  redisClient.set(key,otp);
  redisClient.expire(key, (3*60));
  return otp;
}
/**
 * get/extract otp stored in redis cache
 */
exports.getOTP=function(key,callback){
  redisClient.get(key,function(err,otp){
    if(err) callback(err,null)
    else callback(null,otp)
  })
}
