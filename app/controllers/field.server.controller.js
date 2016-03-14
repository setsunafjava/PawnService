/**
 * Created by Administrator on 1/5/2016.
 */
var dbconn = null;
var Q = require('q');
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
exports.create = function(req,res,id){
    req.body.table_id = id;
    dbconn.query('INSERT INTO tablefields SET ?', req.body, function(err,rec){
        if(err){
            return res.status(400).send({
                message : getErrorMessage(err)
            });
        }else {
            dbconn.query('INSERT INTO tablerecords(value, record_id, field_id) SELECT ?, tr.record_id, ? FROM tablerecords AS tr LEFT JOIN tablefields AS tf ON tf.id = tr.field_id LEFT JOIN datatables AS dt ON dt.id = tf.table_id WHERE dt.id = ? GROUP BY tr.record_id',['',rec.insertId,id],function(err,rec1){
                    if(err){
                        return res.status(400).send({
                            message : getErrorMessage(err)
                        });
                    }else {

                    }
            });
        }

    });
};
exports.list = function(req,res){
    var count  = 0;

    dbconn.query('SELECT count(*) as count FROM tablefields WHERE table_id = ?',req.params.fieldsfordatatableId,function(err, records){
        if(err){
            res.send(err);
        }else{
            var count = (JSON.parse(JSON.stringify(records[0]))).count;
            dbconn.query('SELECT tf.id,tf.title,tr.value,tr.record_id FROM tablerecords AS tr LEFT JOIN tablefields AS tf ON tf.id = tr.field_id LEFT JOIN datatables AS dt ON dt.id = tf.table_id WHERE dt.id = ? ORDER by tr.record_id, tf.title',req.params.fieldsfordatatableId,function(err, records){
                if(err){
                    console.log(err);
                    return res.status(400).send({
                        message : getErrorMessage(err)
                    });

                }else{
                    var data = JSON.parse(JSON.stringify(records));


                    var array = [];
                    var i = 0;
                    var chilArray  = {};
                    data.forEach(function(rd){


                        chilArray[rd.title] = rd.value;

                        i++;
                        if(i==count){
                            i=0;
                            chilArray["record_id"] = rd.record_id;
                            array.push(chilArray);
                            chilArray  = {};
                        }
                    });
                    res.json(array);

                }
            });
        }
    });



};
exports.projectByID = function(req,res,next,id){
    console.log('run param');
    dbconn.query('SELECT * FROM testsuites where id = ?',[id],function(err, records){
        if(err) return next(err);
        if(!records) return next(new Error('Failed to load testsuite: '+ id));
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

    dbconn.query('UPDATE tablefields SET  title=?, type=? WHERE id=?' , [req.body.title,req.body.type, req.body.id], function(err, result){
        if(err){
            return res.status(400).send({
                message : getErrorMessage(err)
            });
        }else {
            res.json(result);
        }
    });

};
exports.delete = function(req,res, id){
    dbconn.query('DELETE FROM tablefields WHERE id =?', [id], function(err, result){
        if(err){
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }else{
            dbconn.query('DELETE FROM tablerecords WHERE  field_id=?', [id], function(err, result1){
                if(err){
                    return res.status(400).send({
                        message: getErrorMessage(err)
                    });
                }else {
                    res.json(result1);
                }
            });
        }
    });

};

exports.hasAuthorization = function (req,res,next) {

    if(req.testsuite.creator.id!==req.user.id){
        return res.status(403).send({
            message : 'User is not authorized'
        });
    }
    next();
};