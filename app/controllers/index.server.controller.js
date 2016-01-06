/**
 * Created by Administrator on 1/5/2016.
 */

exports.showIndex = function(req, res){
    var  username = '';
    if(req.user) {
        username = req.user.username;
    }
    res.cookie('user', JSON.stringify({
        'username': username
    }));
    res.render('index',{
        title : "Haha"
    });
};