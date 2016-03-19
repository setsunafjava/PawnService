/**
 * Created by Administrator on 1/5/2016.
 */
var dbconn = null;
var xlsx = require('node-xlsx');
var _ = require('lodash');
var Q = require('q');
var actionData = require('../../config/actiondata');
var mysql = require('mysql');
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
exports.listFields = function(req,res){
    dbconn.query('SELECT * FROM tablefields where table_id = ?',req.params.fieldfordatatableId,function(err, records){
        if(err){
            ////console.log(err);
            return res.status(400).send({
                message : getErrorMessage(err)
            });

        }else{
            res.json(records);
        }
    });

};
exports.uploadFile = function(req, res){
    var bodyData = req.body;
    console.log(bodyData);
    if (req.fileValidationError) {
        return res.end(req.fileValidationError);
    } else {
        var obj = xlsx.parse(__dirname + '/../../' + req.file.path); // parses a file
        var data = _.result(_.find(obj, function (re) {
            return re.name === "Create Issue";
        }), 'data');
        var array = [];
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].length; j++) {
                if (data[i][j] == 'Create Issue') {
                    array.push({row: i, col: j});
                }
            }
        }

        var startRow = array[0].row + 1
        var startCol = array[0].col + 1;

        var endRow = array[1].row;
        var endCol = array[1].col
        var database = [];
        for (var i = startRow + 1; i < endRow; i++) {
            var objdata = {};
            for (var j = 1; j < endCol; j++) {

                objdata[data[startRow][j]] = data[i][j];

            }
            database.push(objdata);
        }
        actionData.createAllTable(dbconn,'Create Issue',database,res);
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
exports.recordByID = function(req,res,next,id){
    ////console.log('run param: '+ id);
    dbconn.query('SELECT tf.id,tf.title,tr.value,tr.record_id FROM tablerecords AS tr LEFT JOIN tablefields AS tf ON tf.id = tr.field_id where tr.record_id = ?',[id],function(err, records){
        if(err) return next(err);
        if(!records) return next(new Error('Failed to load projects: '+ id));
        var data = JSON.parse(JSON.stringify(records));

        var i = 0;
        var chilArray  = {};
        data.forEach(function(rd){

            ////console.log(i);
            chilArray[rd.title] = rd.value;

            i++;
            if(i==data.length){
                chilArray["record_id"] = rd.record_id;

            }
        });
        req.record = chilArray;
        next();
    });
};
exports.readRecord = function (req,res) {
    res.json(req.record);
};
exports.createRecord = function(req,res){

    dbconn.query('SELECT tr.record_id FROM tablerecords AS tr LEFT JOIN tablefields AS tf ON tf.id = tr.field_id LEFT JOIN datatables AS dt ON dt.id = tf.table_id WHERE dt.id = ? GROUP BY tr.record_id ORDER by tr.id DESC LIMIT 1', [req.params.recordfordatatableId], function(err,records){
        if(err){
            res.json(err);
        }else {
            if(records.length==0){
                var nextId = 0;

            }else {
                var nextId = parseInt(JSON.parse(JSON.stringify(records[0])).record_id.split("_")[2])+1;

            }

            var next_record_id = "RID_"+  req.params.recordfordatatableId +"_" +nextId;
            ////console.log(next_record_id);
            dbconn.query('SELECT * FROM tablefields where table_id = ?',req.params.recordfordatatableId,function(err, records1){
                if(err){
                    return err;

                }else{
                    ////console.log('ok2');
                    var data = JSON.parse(JSON.stringify(records1));
                    var bodyData = req.body;
                    var queries = '';
                    data.forEach(function(rd){
                        queries+=mysql.format('INSERT INTO tablerecords (field_id, value, record_id) values (?,?,?) ;',[rd.id,bodyData[rd.title],next_record_id]);
                    });
                    dbconn.query(queries , function(err,records2){
                        if(err){
                            return res.status(400).send({
                                message : getErrorMessage(err)
                            });
                        }else {
                            res.json(records2);
                        }

                    });
                }
            });

        }

    });



};
exports.deleteRecord = function(req,res){
    dbconn.query('DELETE FROM tablerecords WHERE record_id = ?', [req.record.record_id], function(err, result){
        if(err){
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }else{
            res.json(result);
        }
    });

};
exports.updateRecord = function(req,res){
            dbconn.query('SELECT * FROM tablefields where table_id = ?',req.params.recordfordatatableId,function(err, records1){
                if(err){
                    return err;

                }else{
                    ////console.log('ok2');
                    var data = JSON.parse(JSON.stringify(records1));
                    var bodyData = req.body;
                    var queries = '';
                    ////console.log(data);
                    var record_id = req.record.record_id;
                    data.forEach(function(rd){
                        ////console.log(bodyData[rd.title]);
                        queries+=mysql.format('Update tablerecords SET value = ? where field_id = ? and record_id = ?;', [bodyData[rd.title],rd.id,record_id ]);
                    });
                    ////console.log(queries);
                    dbconn.query(queries , function(err,records2){
                        if(err){
                            return res.status(400).send({
                                message : getErrorMessage(err)
                            });
                        }else {
                            res.json(records2);
                        }

                    });
                }
            });





};
exports.listRecords = function(req,res){
    var count  = 0;
    ////console.log('huhuhuhuh');
    dbconn.query('SELECT count(*) as count FROM tablefields WHERE table_id = ?',req.params.recordfordatatableId,function(err, records){
        if(err){
            res.send(err);
        }else{
            var count = (JSON.parse(JSON.stringify(records[0]))).count;
            dbconn.query('SELECT tf.id,tf.title,tr.value,tr.record_id FROM tablerecords AS tr LEFT JOIN tablefields AS tf ON tf.id = tr.field_id LEFT JOIN datatables AS dt ON dt.id = tf.table_id WHERE dt.id = ? ORDER by  tr.id desc,tr.record_id , tf.title',req.params.recordfordatatableId,function(err, records1){
                if(err){
                    ////console.log(err);
                    return res.status(400).send({
                        message : getErrorMessage(err)
                    });

                }else{
                    var data = JSON.parse(JSON.stringify(records1));

            ////console.log(data);
                    var array = [];
                    var i = 0;
                    var chilArray  = {};
                    data.forEach(function(rd){
                        ////console.log(i);

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
    ////console.log('run param');
    dbconn.query('SELECT * FROM testsuites where id = ?',[id],function(err, records){
        if(err) return next(err);
        if(!records) return next(new Error('Failed to load testsuite: '+ id));
        req.records = records;
        next();
    });
};
exports.read = function (req,res) {
    ////console.log('Abc');
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