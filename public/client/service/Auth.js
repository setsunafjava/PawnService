/**
 * Created by Administrator on 1/5/2016.
 */
'use strict';

angular.module('myApp')
    .factory('Auth', function($http, $cookieStore, $cookies){
        console.log($cookies);
        var currentUser = $cookieStore.get('user') || { username: '' };

        $cookieStore.remove('user');

        function changeUser(user) {
            angular.extend(currentUser, user);
        }

        return {
            isLoggedIn: function(user) {
                if(user === undefined) {
                    user = currentUser;
                }
                return user.username!='';
            },
            signup: function(user, success, error) {
                $http.post('/api/auth/signup', user).success(function(res) {
                    changeUser(res);
                    success();
                }).error(error);
            },
            login: function(user, success, error) {
                $http.post('/api/auth/login', user).success(function(user){
                    changeUser(user);
                    success(user);
                }).error(error);
            },
            logout: function(success, error) {
                $http.post('/api/auth/logout').success(function(){
                    changeUser({
                        username: ''
                    });
                    success();
                }).error(error);
            },
            user: currentUser
        };
    });

