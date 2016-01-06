/**
 * Created by Administrator on 1/5/2016.
 */
var mongoose = require('mongoose'),
    Product = mongoose.model('Product');
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
    var product = new Product(req.body);
    product.creator = req.user;
    product.created = Date.now();

    product.save(function(err){
        if(err){
            return res.status(400).send({
                message : getErrorMessage(err)
            });
        }else {
            res.json(product);
        }
    });
};
exports.list = function(req,res){
    Product.find().sort('-created').populate('creator','ObjectId title trademark year color currentprice oldpricegua galleryproduct description').exec(function(err,product){
        if(err){
            return res.status(400).send({
                message : getErrorMessage(err)
            });

        }else{
            res.json(product);
        }
    });
};
exports.productByID = function(req,res,next,id){
    Product.findById(id).populate('creator','ObjectId title trademark year color currentprice oldpricegua galleryproduct description').exec(function (err,product) {
        if(err) return next(err);
        if(!product) return next(new Error('Failed to load product: '+ id));
        req.product = product;
        next();
    });
};
exports.read = function (req,res) {
    res.json(req.product);
};


exports.update = function (req,res) {
    var product = req.product;
    product.title = req.body.title;
    product.trademark = req.body.trademark;
    product.year = req.body.year;
    product.color = req.body.color;
    product.currentprice = req.body.currentprice;
    product.oldpricegua = req.body.oldpricegua;
    product.galleryproduct = req.body.galleryproduct;
    product.description = req.body.description;
    product.updatetor = req.user;
    product.updated = Date.now();
    product.save(function(err){
        if(err){
            return res.status(400).send({
                message : getErrorMessage(err)
            });
        }else {
            res.json(product);
        }
    });

};
exports.delete = function(req,res){
    var product = req.product;
    product.remove(function (err) {
        if(err){
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }else{
            res.json(product);
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