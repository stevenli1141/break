(function() {
    function ProjectsCtrl($scope, userFactory, restFactory) {
        restFactory.get('/projects').then(function(data) {
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
    }

    ProjectsCtrl.$inject = ['$scope', 'userFactory', 'restFactory'];

    angular.module('break').controller('projectsController', ProjectsCtrl);
})()
