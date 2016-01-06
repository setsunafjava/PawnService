/**
 * Created by Administrator on 1/6/2016.
 */
angular.module('myApp').controller('TradeMarkController',
    function($scope,ResourceTradeMark){
        $scope.create = function(){
            ResourceTradeMark.create($scope.trademark)
                .then(
                /* success function */
                function (result) {

                },
                /* error function */
                function (error) {
                    $scope.error = error;
                });;
        }


    }
);