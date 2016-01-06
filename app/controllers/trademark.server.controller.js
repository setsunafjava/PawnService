/**
 * Created by Administrator on 1/6/2016.
 */
/**
 * Created by Administrator on 1/5/2016.
 */
var mongoose = require('mongoose'),
    TradeMark = mongoose.model('TradeMark');
var getErrorMessage = function(err) {
    if (err.errors) {
        for (var errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].
                message;
        }
    } else {
        return 'Unknown server error';
    }
};
exports.create = function(req,res){
    var trademark = new TradeMark(req.body);
    console.log(req.user);
    trademark.creator = req.user;
    trademark.created = Date.now();
    trademark.save(function(err){
        if(err){
            return res.status(400).send({
                message : getErrorMessage(err)
            });
        }else {
            res.json(trademark);
        }
    });
};
exports.list = function(req,res){
    TradeMark.find().sort('-created').populate('creator','ObjectId title description').exec(function(err,trademark){
        if(err){
            return res.status(400).send({
                message : getErrorMessage(err)
            });

        }else{
            res.json(trademark);
        }
    });
};
exports.trademarkByID = function(req,res,next,id){
    TradeMark.findById(id).populate('creator','ObjectId title description').exec(function (err,trademark) {
        if(err) return next(err);
        if(!trademark) return next(new Error('Failed to load trademark: '+ id));
        req.product = trademark;
        next();
    });
};
exports.read = function (req,res) {
    res.json(req.product);
};


exports.update = function (req,res) {
    var trademark = req.trademark;
    trademark.title = req.body.title;
    trademark.description = req.body.description;
    trademark.updatetor = req.user;
    trademark.updated = Date.now();
    trademark.save(function(err){
        if(err){
            return res.status(400).send({
                message : getErrorMessage(err)
            });
        }else {
            res.json(trademark);
        }
    });

};
exports.delete = function(req,res){
    var trademark = req.trademark;
    trademark.remove(function (err) {
        if(err){
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }else{
            res.json(trademark);
        }
    });
};

exports.hasAuthorization = function (req,res,next) {
    if(req.product.creator.id!==req.user.id){
        return res.status(403).send({
            message : 'User is not authorized'
        });
    }
    next();
};