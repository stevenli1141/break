(function() {
    function IssuesCtrl($scope, userFactory, resourceFactory) {
        var self = this;

        $scope.filters = { title: '', project: { key: userFactory.project || '' } };
        
        var getParams = function() {
            return {
                title: $scope.filters.title,
                projectkey: $scope.filters.project.key
            };
        }

        resourceFactory.get('/issues', getParams()).then(function(data) {
            $scope.issues = data;
            $scope.$apply();
        }).catch(function(err) {
            $scope.issues = [];
        });

        $scope.update = function() {
            resourceFactory.get('/issues', getParams()).then(function(data) {
                $scope.issues = data;
                $scope.$apply();
            }).catch(function(err) {
                $scope.issues = [];
            });
        };

        $scope.loadProjects = function() {
            return resourceFactory.get('/projects', {
                name: $scope.filters.project
            }).then(function(data) {
                return data;
            }).catch(function(err) {
                return [];
            });
        }
    }

    IssuesCtrl.$inject = ['$scope', 'userFactory', 'resourceFactory'];

    angular.module('break').controller('issuesController', IssuesCtrl);
})()
