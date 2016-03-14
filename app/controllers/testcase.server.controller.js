/**
 * Created by Administrator on 1/5/2016.
 */
var dbconn = null
exports.initData = function (db) {
    dbconn = db;
};
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

    dbconn.query('INSERT INTO testcases SET ?', req.body, function(err,res){
        if(err){
            return res.status(400).send({
                message : getErrorMessage(err)
            });
        }else {
            res.json({id: res.insertId});
        }

    });
};
exports.list = function(req,res){
    dbconn.query('SELECT * FROM testcases where testsuite_id = ?',req.params.testcasesfortestsuiteId,function(err, records){
        if(err){
            console.log(err);
            return res.status(400).send({
                message : getErrorMessage(err)
            });

        }else{
            res.json(records);
        }
    });

};
exports.testcaseByID = function(req,res,next,id){
    console.log('run param');
    dbconn.query('SELECT * FROM testcases where id = ?',[id],function(err, records){
        if(err) return next(err);
        if(!records) return next(new Error('Failed to load testcase: '+ id));
        req.records = records;
        next();
    });
};
exports.read = function (req,res) {
    console.log('Abc');
    res.json(req.records);
};


exports.update = function (req,res) {
    // title = ?, alias= ?, detail= ?, status = ? WHERE id= ?

    dbconn.query('"UPDATE testcases SET ? WHERE id= ?', [req.body, req.records.id], function(err, result){
        if(err){
            return res.status(400).send({
                message : getErrorMessage(err)
            });
        }else {
            res.json(result);
        }
    });

};
exports.delete = function(req,res){
    dbconn.query('DELETE FROM testcases WHERE id = ?', [req.records.id], function(err, result){
        if(err){
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }else{
            res.json(result);
        }
    });

};

exports.hasAuthorization = function (req,res,next) {

    if(req.testcase.creator.id!==req.user.id){
        return res.status(403).send({
            message : 'User is not authorized'
        });
    }
    next();
};