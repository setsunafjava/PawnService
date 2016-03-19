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

    dbconn.query('INSERT INTO datatables SET ?', req.body, function(err,res){
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
    dbconn.query('SELECT * FROM datatables where package_id=?',req.params.datatablesforpackagesId,function(err, records){
        if(err){
           // console.log(err);
            return res.status(400).send({
                message : "Load DataTable Error"
            });

        }else{
            res.json(records);
        }
    });

};
exports.listRecords = function(req,res){
    dbconn.query("SELECT dt.*, pp.project_id, pj.title as project, pk.title as package FROM datatables AS dt INNER JOIN packages AS pk ON dt.package_id=pk.id INNER JOIN project_package AS pp ON pp.package_id=pk.id INNER JOIN projects AS pj ON pp.project_id=pj.id",function(err, records){
        if(err){
          //  console.log(err);
            return res.status(400).send({
                message : getErrorMessage(err)
            });

        }else{
            res.json(records);
        }
    });
};
exports.datarecordByID = function(req,res,next,id){
    //console.log('run param');
    dbconn.query("SELECT dt.*, pp.project_id, pj.title as project, pk.title as package FROM datatables AS dt INNER JOIN packages AS pk ON dt.package_id=pk.id INNER JOIN project_package AS pp ON pp.package_id=pk.id INNER JOIN projects AS pj ON pp.project_id=pj.id WHERE dt.id = ? ",[id],function(err, records){
        if(err) return next(err);
        if(!records) return next(new Error('Failed to load datatable: '+ id));
        req.datarecords = records;
        next();
    });
};

exports.datatableByID = function(req,res,next,id){
  //  console.log('run param');
    dbconn.query('SELECT * FROM datatables where id = ?',[id],function(err, records){
        if(err) return next(err);
        if(!records) return next(new Error('Failed to load datatable: '+ id));
        req.records = records;
        next();
    });
};
exports.read = function (req,res) {
    //console.log('Abc');
    res.json(req.records);
};

exports.readRecords = function(req,res){
    res.json(req.datarecords);
};
exports.readtest = function(req,res){

    res.json(req.param('a1'));
};
exports.update = function (req,res) {
    // title = ?, alias= ?, detail= ?, status = ? WHERE id= ?

    dbconn.query('"UPDATE datatables SET ? WHERE id= ?', [req.body, req.body.id], function(err, result){
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
    dbconn.query('DELETE FROM datatables WHERE id = ?', [req.datatable.id], function(err, result){
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

    if(req.datatable.creator.id!==req.user.id){
        return res.status(403).send({
            message : 'User is not authorized'
        });
    }
    next();
};