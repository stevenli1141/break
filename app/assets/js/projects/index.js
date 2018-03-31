(function() {
    function ProjectsCtrl($scope, userFactory, restFactory) {
        $scope.user = {};

        restFactory.get('/user').then(function(user) {
            $scope.user = user;
            $scope.$apply();
            return restFactory.get('/projects');
        }).then(function(data) {
            $scope.projects = data;
            $scope.$apply();
        }).catch(function(err) {
            $scope.projects = [];
        });

        $scope.update = function() {
            restFactory.get('/projects').then(function(data) {
                $scope.projects = data;
                $scope.$apply();
            }).catch(function(err) {
                $scope.projects = [];
            });
        };

        $scope.admin = function() {
            return $scope.user.admin;
        }
    }

    ProjectsCtrl.$inject = ['$scope', 'userFactory', 'restFactory'];

    angular.module('break').controller('projectsController', ProjectsCtrl);
})()
