app.factory("Data", ['$http', 'toaster',
    function ($http, toaster) { // This service connects to our REST API

        var serviceBase = '/api/';

        var obj = {};
        obj.toast = function (data) {
            toaster.pop(data.status, "", data.message, 10000, 'trustedHtml');
        }
        obj.get = function (q) {
            return $http.get(serviceBase + q).then(function (results) {

                return results.data;
            });
        };
        obj.postUpload = function(q,object,file){
            var fd = new FormData(object);
            fd.append('file',file);
            fd.append('sheetname',object.sheetname);
            fd.append('tablename',object.tablename);

            return $http.post(q,fd,{
                transformRequest : angular.identity,
                headers:{
                    'Content-Type':undefined,
                    enctype : 'multipart/form-data'

                }
            }).then(function (results) {
                return results.data;
            });
        };
        obj.post = function (q, object) {
            return $http.post(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        };
        obj.put = function (q, object) {
            return $http.put(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        };
        obj.delete = function (q) {
            return $http.delete(serviceBase + q).then(function (results) {
                return results.data;
            });
        };

        return obj;
}]);