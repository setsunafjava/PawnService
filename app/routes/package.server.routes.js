/**
 * Created by Administrator on 1/5/2016.
 */
var authentication = require('../../app/controllers/authentication.server.controller'),
    package = require('../../app/controllers/package.server.controller');
module.exports =function(app,db){
    package.initData(db);

    console.log('run routes');
    app.route('/api/packageforproject/:packageforprojectId')
        .get(package.list)
        .post(authentication.requiresLogin,package.create);
    app.route('/api/packages/:packageId')
        .get(package.read)
        .put(authentication.requiresLogin,package.update)
        .delete(authentication.requiresLogin,package.delete);

    app.param('packageId',package.packageByID);
};