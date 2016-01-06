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
                console.log(response);
                $scope.error = response.message || response;
            }

        )

    };
    $scope.signup = function(){
        console.log('abc');
        $scope.error = null;
        $http.post('/api/auth/signup',$scope.credentials)
            .success(function (response) {
                $scope.authentication.user = response;
                $state.go('main');
            }).error(function (response) {
                console.log(response);
                $scope.error = response.message || response;
            });
    };
}]);