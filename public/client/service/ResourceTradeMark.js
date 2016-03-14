/**
 * Created by Administrator on 1/6/2016.
 */
angular.module('myApp')
    .factory('ResourceTradeMark', function ($q, $stateParams, $location, Auth, TradeMarkService) {

        return {
            create: function (trademark) {
                console.log(trademark);
                var deferred = $q.defer();
                var trademark = new TradeMarkService(trademark);
                trademark.$save(function (response) {
                    deferred.resolve("Ok");
                   // $location.path('trademark/' + response._id);
                }, function (errorResponse) {
                    deferred.reject(errorResponse.data.message);
                });
                return deferred.promise;
            },
            find: function () {
                return TradeMarkService.query();
            },

            findOne: function () {
                return TradeMarkService.get({
                    trademarkId: $stateParams.trademarkId
                });

            },

            update: function (trademark) {
                trademark.$update(function () {
                    $location.path('trademarks/' + $scope.trademark._id);
                }, function (errorResponse) {
                    return errorResponse.data.message;
                });
            },

            delete: function (trademark) {

                trademark.$remove(function () {
                    $location.path('trademarks');
                });
            }

        };
    });

