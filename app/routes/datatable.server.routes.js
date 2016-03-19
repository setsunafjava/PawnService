/**
 * Created by Administrator on 1/5/2016.
 */
var authentication = require('../../app/controllers/authentication.server.controller'),
    datatable = require('../../app/controllers/datatable.server.controller');
module.exports =function(app,db){
    datatable.initData(db);
    console.log('run routes');
    app.route('/api/datatablesforpackage/:datatablesforpackagesId')
        .get(datatable.list)
        .post(authentication.requiresLogin,datatable.create);
    app.route('/api/datatables/:datatableId')
        .get(datatable.read)
        .put(authentication.requiresLogin,datatable.update)
        .delete(authentication.requiresLogin,datatable.delete);
    //app.route('/api/datatablesRecords')
    //    .get(datatable.listRecords);
    //app.route('/api/datatablesRecords/:datarecordID')
    //    .get(datatable.readRecords);
    //app.param('datatableId',datatable.datatableByID);
    //app.param('datarecordID',datatable.datarecordByID);
    //app.route('/api/test/:a1/:a2/:a3')
    //    .get(datatable.readtest);

};