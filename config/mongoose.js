/**
 * Created by Administrator on 1/5/2016.
 */
var config = require('./config'),
    mongoose = require('mongoose');

module.exports = function(){
    require('../app/models/user.server.model');
    require('../app/models/product.server.model');
    require('../app/models/trademark.server.model');

    var db = mongoose.connect(config.db);
    return db;
};