(function() {
    function ProjectsCtrl($scope, resourceFactory) {
        resourceFactory.get('/projects').then(function(data) {
            $scope.projects = data;
            $scope.$apply();
        }).catch(function(err) {
            $scope.projects = [];
        });

        $scope.update = function() {
            resourceFactory.get('/projects').then(function(data) {
                $scope.projects = data;
                $scope.$apply();
            }).catch(function(err) {
                $scope.projects = [];
            });
        };
    }

    ProjectsCtrl.$inject = ['$scope', 'resourceFactory'];

    angular.module('break').controller('projectsController', ProjectsCtrl);
})()
