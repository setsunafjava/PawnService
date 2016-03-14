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
console.log(req.body);
    dbconn.query('INSERT INTO projects SET ?', req.body, function(err,rs){
        if(err){
            return res.send(err);
        }else {
            res.json({id: rs.insertId});
        }

    });
};
exports.list = function(req,res){
    dbconn.query('SELECT * FROM projects',function(err, records){
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
exports.projectByID = function(req,res,next,id){
    console.log('run param');
    dbconn.query('SELECT * FROM projects where id = ?',[id],function(err, records){
        if(err) return next(err);
        if(!records) return next(new Error('Failed to load projects: '+ id));

        req.records = JSON.parse(JSON.stringify(records[0]));
        next();
    });
};
exports.read = function (req,res) {
    console.log('Abc');
    res.json(req.records);
};


exports.update = function (req,res) {
    // title = ?, alias= ?, detail= ?, status = ? WHERE id= ?

    dbconn.query('UPDATE projects SET ? WHERE id = ?', [req.body, req.records.id], function(err, result){
        if(err){
            res.send(err);
        }else {
            res.json(result);
        }
    });

};
exports.delete = function(req,res){
    console.log(req.records.id);
    dbconn.query('DELETE FROM projects WHERE id = ?', [req.records.id], function(err, result){
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

    if(req.project.creator.id!==req.user.id){
        return res.status(403).send({
            message : 'User is not authorized'
        });
    }
    next();
};