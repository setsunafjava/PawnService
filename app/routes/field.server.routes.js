/**
 * Created by Administrator on 1/5/2016.
 */
var authentication = require('../../app/controllers/authentication.server.controller'),
    field = require('../../app/controllers/field.server.controller');
module.exports =function(app,db){
    field.initData(db);
    console.log('run routes');
    app.route('/api/fieldsfordatatable/:fieldsfordatatableId')
        .get(field.list)
        .post(authentication.requiresLogin,field.create);
    app.route('/api/fields/:fieldId')
        .get(field.read)
        .put(authentication.requiresLogin,field.update)
        .delete(authentication.requiresLogin,field.delete);
    //app.route('/api/fieldsRecords')
    //    .get(field.listRecords);
    //app.route('/api/fieldsRecords/:datarecordID')
    //    .get(field.readRecords);
    //app.param('fieldId',field.fieldByID);
    //app.param('datarecordID',field.datarecordByID);
    //app.route('/api/test/:a1/:a2/:a3')
    //    .get(field.readtest);

};