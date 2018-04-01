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
        $scope.user = {};
        $scope.current_user = {};

        restFactory.get(window.location.pathname).then(function(user) {
            $scope.user = user;
            $scope.$apply();
        });

        restFactory.get('/user').then(function(u) {
            $scope.current_user = u;
            $scope.$apply();
        });

        $scope.admin = function() {
            return $scope.current_user.admin;
        }

        $scope.loadProjects = function() {
            return restFactory.get('/projects', { name: $scope.project }).then(function(data) {
                return data;
            }).catch(function(err) {
                return [];
            });
        }
        
        $scope.addUserToProject = function(project) {
            console.log(project);
            restFactory.put(window.location.pathname, { addProject: project._id }).then(function(data) {
                $scope.user = data;
                $scope.$apply();
            }).catch(function(err) {
                console.log(err);
            });
        }
    }

    UserCtrl.$inject = ['$scope', 'restFactory'];

    angular.module('break')
        .controller('usersController', UsersCtrl)
        .controller('userController', UserCtrl);
})()
