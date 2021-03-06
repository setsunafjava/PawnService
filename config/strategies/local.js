/**
 * Created by Administrator on 1/5/2016.
 */
var passport = require('passport'),
    LocalStraegy = require('passport-local').Strategy,
    User = require('mongoose').model('User');
module.exports = function(){
    passport.use(new LocalStraegy(function(username, password ,done){
        User.findOne({
            username :username
        },function(err,user){
            if(err){
                return done(err);
            }
            if(!user){
                return done(null,false,{
                    message :'Unknow user'
                });
            }
            if(!user.authenticate(password)){
                return done(null,false,{
                    message : 'Invalid password'
                });
            }
            return done(null,user);
        })

    }));

}