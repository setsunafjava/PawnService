app.controller('authCtrl', function ($scope, $rootScope, $location, $http, Data,$state) {
    //initially set those objects to null to avoid undefined error
    $scope.login = {};
    $scope.signup = {};
    $scope.doLogin = function (customer) {
        Data.post('login', {
            customer: customer
        }).then(function (results) {
            Data.toast(results);
            if (results.status == "success") {
                $state.go('report');
            }
        });
    };
    $scope.signup = {email:'',password:'',name:'',phone:'',address:''};
    $scope.signUp = function (customer) {
        Data.post('signUp', {
            customer: customer
        }).then(function (results) {
            Data.toast(results);
            if (results.status == "success") {
                $state.go('report');
            }
        });
    };
    $rootScope.logout = function () {

        Data.get('logout').then(function (results) {
            Data.toast(results);
            $state.go('login');
        });
    }
});