/**
 * Created by Administrator on 1/5/2016.
 */

process.env.NODE_EVN = process.env.NODE_EVN || 'development';
var express = require('./config/express'),
    mongoose = require('./config/mongoose'),
    passport = require('./config/passport') ;
var db = mongoose();
var app = express();

var passport = passport();
var server = require('http').createServer(app);
server.listen(3000,function(err){
    console.log('Listening 3000....');

});
module.exports = app;