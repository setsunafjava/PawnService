/**
 * Created by Administrator on 1/5/2016.
 */
var authentication = require('../../app/controllers/authentication.server.controller'),
    product = require('../../app/controllers/product.server.controller');
module.exports =function(app){
    console.log('run routes');
    app.route('/api/products')
        .get(authentication.requiresLogin,product.list)
        .post(authentication.requiresLogin,product.create);
    app.route('/api/products/:productId')
        .get(authentication.requiresLogin,product.read)
        .put(authentication.requiresLogin,product.update)
        .delete(authentication.requiresLogin,product.delete);

    app.param('productId',product.productByID);
};