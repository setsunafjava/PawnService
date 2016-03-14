/**
 * Created by Administrator on 1/5/2016.
 */
var authentication = require('../../app/controllers/authentication.server.controller'),
    project = require('../../app/controllers/project.server.controller');
module.exports =function(app,db){
    project.initData(db);
    console.log('run routes');
    app.route('/api/projects')
        .get(project.list)
        .post(project.create);
    app.route('/api/projects/:projectId')
        .get(project.read)
        .put(project.update)
        .delete(project.delete);

    app.param('projectId',project.projectByID);
};