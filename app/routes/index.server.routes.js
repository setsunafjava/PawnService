/**
 * Created by Administrator on 1/5/2016.
 */
module.exports = function(app){
    var index = require('../controllers/index.server.controller');
    app.get('/',index.showIndex);
};