/**
 * Created by Administrator on 1/5/2016.
 */
var authentication = require('../../app/controllers/authentication.server.controller'),
    field = require('../../app/controllers/field.server.controller');

var multer  = require('multer');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname+ '-' + Date.now()+'.jpg')
    }
});
var upload = multer(
    {
        storage: storage,
        fileFilter: function (req, file, cb) {
            //console.log(file.mimetype);
            if (file.mimetype != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && file.mimetype !='application/vnd.ms-excel') {
                //console.log("aaaaaa");
                req.fileValidationError = 'goes wrong on the excel';
                return cb(null, false, new Error('goes wrong on the excel'));
            }
            cb(null, true);}
    }
);
module.exports =function(app,db){
    field.initData(db);
    //console.log('run routes');
    app.route('/api/recordfordatatable/:recordfordatatableId')
        .get(field.listRecords).post(field.createRecord);
    app.route('/api/recordfordatatable/:recordfordatatableId/:recordId')
        .get(field.readRecord).put(field.updateRecord).delete(field.deleteRecord);
    app.param('recordId',field.recordByID);

    app.route('/api/fieldfordatatable/:fieldfordatatableId')
        .get(field.listFields)
        .post(authentication.requiresLogin,field.create);
    app.route('/api/fields/:fieldId')
        .get(field.read)
        .put(authentication.requiresLogin,field.update)
        .delete(authentication.requiresLogin,field.delete);
    app.route('/multer').post(upload.single('file'),field.uploadFile);
};