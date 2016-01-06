/**
 * Created by Administrator on 1/5/2016.
 */
module.exports  = function(app){
    var authentication = require('../controllers/authentication.server.controller');
    app.route('/api/auth/login').post(authentication.login);
    app.route('/api/auth/signup').post(authentication.signup);
    app.route('/api/auth/logout').post(authentication.logout);

};