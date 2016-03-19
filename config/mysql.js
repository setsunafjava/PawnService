/**
 * Created by Admin on 3/9/2016.
 */
var config = require('./database'),
    mysql = require('mysql');

module.exports = function(){
    console.log('AAAA');
    var dbconn = mysql.createConnection(config.connection);


    dbconn.connect(function(err){
        if(err){
            console.log('Database connection error');
        }else{
            console.log('Database connection successful');
        }
    });
    return dbconn;
};

