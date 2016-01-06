/**
 * Created by Administrator on 1/5/2016.
 */
angular.module('myApp').controller('NavbarController',function($scope,Auth,$state,cfpLoadingBar,$timeout){
    if(!Auth.isLoggedIn()){
        $state.go('login');
    }
    $scope.auth = Auth;
    $scope.logout = function() {
        Auth.logout(function() {
            $state.go("login");
        }, function() {
            //$rootScope.error = "Failed to logout";
        });
    };
});