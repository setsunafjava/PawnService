/**
 * Created by Admin on 3/18/2016.
 */
var _ = require('lodash');

var insertId = function (db,values, callback) {

        db.query('INSERT INTO tablefields SET ?', values, function(err,r2){
            if(err){
                return callback(err);
            }
                callback(null,r2.insertId);



        });

};
var getArrayId = function (db,r1,data,callback) {
    var objId = {};
    var pendingJobCount = _.size(data);
    _.forIn(data, function (value, key) {
        insertId(db,{title: key, table_id : r1.insertId, type: 'text'},function(err,r2){
            if(err) {
                return callback(err);
            }else {
                objId[key] =r2;
                if (--pendingJobCount === 0) callback(null, objId);
            }

        });
    });
};
exports.createAllTable = function(db,nametable,data,res){
    db.query('INSERT INTO datatables SET ?', {title : nametable }, function(err,r1){
        if(err){

        }else {
            var values = [];

            getArrayId(db,r1,data[0],function(err,objId){
                if(err) {
                    console.log(err);

                }else{
                    var pendingJobCount = _.size(data);
                    _.forEach(data,function(objectRecord){
                        var index = 1;
                        _.forIn(objectRecord,function(value,key){
                            var next_record_id = "RID_"+  r1.insertId +"_" +1;
                            //INSERT INTO tablerecords (field_id, value, record_id) values (?,?,?)
                            value = (value==null || value==undefined)?'':value;
                            db.query('INSERT INTO tablerecords (field_id, value, record_id) values (?,?,?)',[objId[key],value,next_record_id], function (err,r3) {
                                if(err){
                                    return res.status(400).send({
                                        message : 'Error in ' + [objId[key],value,next_record_id] + ' edit data try again'
                                    });
                                }
                            });
                        });
                        if (--pendingJobCount === 0) res.status(200).send({
                            message : 'Success ' + _.size(data) + ' record'
                        });
                    });
                }
            });


        }

    });


};