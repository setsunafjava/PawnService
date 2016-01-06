/**
 * Created by Tommy_Phan on 20/11/2015.
 */
angular.module('myApp').controller('LoginController',['$scope','$http','$state','$location','Auth',function($scope,$http,$state,$location,Auth){
    $scope.authentication = Auth.user;
    console.log(Auth.isLoggedIn());

    if(Auth.isLoggedIn()){
        $state.go('main');
    }

    $scope.login = function(){
        $scope.error  = null;

        Auth.login($scope.credentials,
            function (response){
                $state.go('main');
              //  console.log(response);
               // $scope.error = response.message || response;
            },function (response) {
                $scope.error = response.message || response;
            }

        )

    };
    $scope.signup = function() {
        Auth.signup($scope.credentials,
            function(response) {
                $state.go('main');
            },
            function(response) {
                $scope.error = response.message || response;
            });
    };
}]);