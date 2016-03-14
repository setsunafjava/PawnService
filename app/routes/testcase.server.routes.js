/**
 * Created by Administrator on 1/5/2016.
 */
var authentication = require('../../app/controllers/authentication.server.controller'),
    testcase = require('../../app/controllers/testcase.server.controller');
module.exports =function(app,db){
    testcase.initData(db);
    console.log('run routes');
    app.route('/api/testcasesfortestsuite/:testcasesfortestsuiteId')
        .get(testcase.list)
        .post(authentication.requiresLogin,testcase.create);
    app.route('/api/testcases/:testcaseId')
        .get(testcase.read)
        .put(authentication.requiresLogin,testcase.update)
        .delete(authentication.requiresLogin,testcase.delete);

    app.param('testcaseId',testcase.testcaseByID);
};