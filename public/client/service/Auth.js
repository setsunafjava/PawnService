/**
 * Created by Administrator on 1/5/2016.
 */
'use strict';

angular.module('myApp')
    .factory('Auth', function($http, $cookieStore){

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
            register: function(user, success, error) {
                $http.post('/register', user).success(function(res) {
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

