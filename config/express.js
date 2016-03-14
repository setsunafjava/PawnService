/**
 * Created by Administrator on 1/5/2016.
 */
var express = require('express'),
    morgan = require('morgan'),
    path = require('path'),
    csrf = require('csurf'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride  = require('method-override'),
    session = require('express-session'),
    passport  =require('passport'),
    flash = require('connect-flash'),
    config = require('./config'),
    multer	=	require('multer');
var storage	=	multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now()+file.originalname);
    }
});

var upload = multer({ storage : storage,maxCount: 4,
    onFileUploadStart: function (file) {
        console.log(file.name + ' is starting ...');
    },
    onFileUploadComplete: function (file, req, res) {
        console.log(file.name + ' uploading is ended ...');
        console.log("File name : "+ file.name +"\n"+ "FilePath: "+ file.path)
    },
    onError: function (error, next) {
        console.log("File uploading error: => "+error)
        next(error)
    }



});

require('./passport')(passport); // pass passport for configuration




module.exports = function () {
    var app = express();

   // if(process.env.NODE_ENV=== 'development'){
    //    app.use(morgan('dev'));
/*
    }else if(process.env.NODE_ENV === 'production'){
        app.use(compress());
    }*/
    app.use(bodyParser.urlencoded({extended : true}));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(express.static('./public'));
    app.use(session({
        secret :config.sessionSecret
    }));
    /*app.use(csrf());
    app.use(function(req,res,next){
        res.cookie('XSRF-TOKEN',req.csrfToken());
        next();
    });*/
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    app.set('views','./app/views');
    app.set('view engine', 'ejs');
    var dbconn1 = require('./mysql')(),
        config1 = require('./database');
    dbconn1.query('USE ' + config1.database);
    require('../app/routes/index.server.routes.js')(app);
    require('../app/routes/authentication.server.routes.js')(app);
    require('../app/routes/project.server.routes.js')(app,dbconn1);
    require('../app/routes/package.server.routes.js')(app,dbconn1);
    require('../app/routes/testsuite.server.routes.js')(app,dbconn1);
    require('../app/routes/testcase.server.routes.js')(app,dbconn1);
    require('../app/routes/datatable.server.routes.js')(app,dbconn1);
    require('../app/routes/field.server.routes.js')(app,dbconn1);


    //require('../app/routes/trademark.server.routes.js')(app);
    //var authentication = require('../app/controllers/authentication.server.controller');
    //
    //    app.post('/api/photo',authentication.requiresLogin,upload.single('file'),function(req, res, next) {
    //    //...
    //        res.status(200).send("Ok");
    //        console.log(req);
    //});
    return app;
};