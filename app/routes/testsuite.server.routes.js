/**
 * Created by Administrator on 1/5/2016.
 */
var authentication = require('../../app/controllers/authentication.server.controller'),
    testsuite = require('../../app/controllers/testsuite.server.controller');
module.exports =function(app,db){
    testsuite.initData(db);
    console.log('run routes');
    app.route('/api/testsuitesforpackage/:testsuitesforpackageId')
        .get(testsuite.list)
        .post(authentication.requiresLogin,testsuite.create);
    app.route('/api/testsuites/:testsuiteId')
        .get(testsuite.read)
        .put(authentication.requiresLogin,testsuite.update)
        .delete(authentication.requiresLogin,testsuite.delete);

    app.param('testsuiteId',testsuite.testsuiteByID);
};