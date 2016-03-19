var app = angular.module('myApp', [ 'ngAnimate', 'toaster','ui.router']);
app.factory('_', ['$window',
    function($window) {
        // place lodash include before angular
        return $window._;
    }
]);
app.directive('context', [

    function() {
        return {
            restrict: 'A',
            scope: '@&',
            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    post: function postLink(scope, iElement, iAttrs, controller) {
                        var ul = $('#context'),
                            last = null;
                        ul.css({
                            'display': 'none'
                        });
                        $(iElement).bind('contextmenu', function(event) {
                            $('#context li a').attr('record_id',iAttrs.id);

                            event.preventDefault();
                            ul.css({
                                position: "fixed",
                                display: "block",
                                left: event.clientX + 'px',
                                top: event.clientY + 'px'
                            });
                            last = event.timeStamp;
                        });
                        //$(iElement).click(function(event) {
                        //  ul.css({
                        //    position: "fixed",
                        //    display: "block",
                        //    left: event.clientX + 'px',
                        //    top: event.clientY + 'px'
                        //  });
                        //  last = event.timeStamp;
                        //});

                        $(document).click(function(event) {
                            var target = $(event.target);
                            if (!target.is(".popover") && !target.parents().is(".popover")) {
                                if (last === event.timeStamp)
                                    return;
                                ul.css({
                                    'display': 'none'
                                });
                            }
                        });
                    }
                };
            }
        };
    }
]);
app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/login');
	$stateProvider

    // HOME STATES AND NESTED VIEWS ========================================
	.state('login', {
        url: '/login',
        templateUrl: '../views/mailbox.html',
        controller: 'authCtrl'
    }).state('logout', {
        url: '/logout',
        templateUrl: 'partials/login.html',
        controller: 'authCtrl'
    }).state('signup', {
        url: '/signup',
        templateUrl: '../views/signup.html',
        controller: 'authCtrl'
    }).state('report', {
        url: '/report',
        templateUrl: '../views/report.html'
    }).state('project', {
        url: '/project',
        templateUrl: '../views/project.html'
    }).state('package', {
        url: '/package',
        templateUrl: '../views/package.html'
    }).state('category', {
        url: '/category',
        templateUrl: '../views/category.html'
    }).state('testsuite', {
        url: '/testsuite',
        templateUrl: '../views/testsuite.html'
    }).state('testcase', {
        url: '/testcase',
        templateUrl: '../views/testcase.html'
    }).state('datatable', {
        url: '/datatable',
        templateUrl: '../views/datatable.html'
    }).state('demo', {
        url: '/demo',
        templateUrl: '../views/demo.html'
    }).state('mailbox', {
            url: '/mailbox',
            templateUrl: '../views/mailbox.html'
        });
}).run(function ($rootScope, $location, Data,$state) {
    $rootScope.$on("$stateChangeStart", function (event, next, current) {
        $rootScope.authenticated = true;

       /* Data.get('session').then(function (results) {
            if (results.uid) {
                $rootScope.authenticated = true;
                $rootScope.uid = results.uid;
                $rootScope.name = results.name;
                $rootScope.email = results.email;
               // $state.go('report');
            } else {

                var nextUrl = next.url;
                console.log(nextUrl);
                if (nextUrl == '/signup' || nextUrl == '/login') {

                } else {
                	$state.go('login');
                }
            }
        });*/
    });
});

