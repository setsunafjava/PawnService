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
    config = require('./config');


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
    app.use(csrf());
    app.use(function(req,res,next){
        res.cookie('XSRF-TOKEN',req.csrfToken());
        next();
    });
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    app.set('views','./app/views');
    app.set('view engine', 'ejs');

    require('../app/routes/index.server.routes.js')(app);
    require('../app/routes/authentication.server.routes.js')(app);
    require('../app/routes/product.server.routes.js')(app);
    require('../app/routes/trademark.server.routes.js')(app);

    return app;
};