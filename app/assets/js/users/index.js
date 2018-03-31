(function() {
    function UsersCtrl($scope, restFactory) {        
        $scope.users = [];

        restFactory.get('/users').then(function(data) {
            $scope.users = data;
            $scope.$apply();
        }).catch(function(err) {
            $scope.users = [];
        });

        $scope.update = function() {
            restFactory.get('/users').then(function(data) {
                $scope.projects = data;
                $scope.$apply();
            }).catch(function(err) {
                $scope.projects = []
                $scope.$apply();
            });
        };
    }

    UsersCtrl.$inject = ['$scope', 'restFactory'];

    function UserCtrl($scope, restFactory) {
        restFactory.get(window.location.pathname).then(function(user) {
            $scope.user = user;
            $scope.$apply();
        });
    }

    UserCtrl.$inject = ['$scope', 'restFactory'];

    angular.module('break')
        .controller('usersController', UsersCtrl)
        .controller('userController', UserCtrl);
})()
