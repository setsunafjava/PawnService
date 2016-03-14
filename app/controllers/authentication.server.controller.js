/**
 * Created by Tommy_Phan on 21/11/2015.
 */
var    passport = require('passport');
var getUniqueErrorMessage = function (err) {
    var output;

    try {
        var fieldName = err.errmsg.substring(err.errmsg.lastIndexOf('.$') + 2, err.errmsg.lastIndexOf('_1'));
        output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';

    } catch (ex) {
        output = 'Unique field already exists';
    }

    return output;
};
var getErrorMessage = function (err) {
    var message = '';

    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = getUniqueErrorMessage(err);
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) {
                message = err.errors[errName].message;
            }
        }
    }

    return message;
};
exports.login = function (req,res,next){
    passport.authenticate('local-login',function(err,user,info){
        if(err|| !user){
            res.status(400).send(info);
        }else {
            req.login(user,function(err){
               if(err){
                   res.status(400).send(err);
               } else{


                   console.log(req.body.rememberme);
                   if(req.body.rememberme) req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
                   else req.session.cookie.expires = false;
                   //res.json(user);

                   res.json(200,{"username": user.username });

               }
            });
        }
    })(req,res,next);
};
exports.signup = function(req, res) {
    if (!req.user) {
        var user = new User(req.body);
        var message = null;
        user.provider = 'local';
        user.save(function(err) {
            if (err) {
                return res.status(400).send({
                    message : getErrorMessage(err)
                });
            }else {
                user.password = undefined;
                user.salt = undefined;
                req.login(user, function(err) {
                    if (err) {
                        res.status(400).send(err);
                    }else {
                        res.json(user);
                    }

                });
            }

        });
    }else {
        res.status(400).send(req.user.fullName + ' logined');
    }
};
exports.logout = function (req,res) {
    req.logout();
    res.redirect('/');
};
exports.requiresLogin = function(req,res,next){
    if(!req.isAuthenticated()){
        return res.status(401).send({
            message : 'User is not logged in'
        });
    }
    next();
};