/**
 * Created by Administrator on 1/5/2016.
 */
angular.module('myApp').config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){
    $urlRouterProvider.otherwise('/main');

    $stateProvider.state('main',{
        url : '/main',
        templateUrl :'/client/pages/main.html'
    }).state('login',{
        url : '/login',
        templateUrl:  '/client/pages/login.html',
        controller :'LoginController'


    }).state('signup',{
        url : '/signup',
        templateUrl: '/client/pages/signup.html',
        controller :'LoginController'

    }).state('newtrademark',{
        url : '/newtrademark',
        templateUrl: '/client/pages/newtrademark.html',
        controller :'TradeMarkController'

    })

});