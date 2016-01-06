/**
 * Created by Administrator on 1/6/2016.
 */
/**
 * Created by Administrator on 1/5/2016.
 */
var authentication = require('../../app/controllers/authentication.server.controller'),
    trademark = require('../../app/controllers/trademark.server.controller');
module.exports =function(app){
    console.log('run routes');
    app.route('/api/trademarks')
        .get(authentication.requiresLogin,trademark.list)
        .post(authentication.requiresLogin,trademark.create);
    app.route('/api/trademarks/:trademarkId')
        .get(authentication.requiresLogin,trademark.read)
        .put(authentication.requiresLogin,trademark.update)
        .delete(authentication.requiresLogin,trademark.delete);

    app.param('trademarkId',trademark.trademarkByID);
};