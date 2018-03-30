(function() {
    function IssuesCtrl($scope, userFactory, restFactory) {
        var self = this;

        $scope.filters = { title: '', project: { key: userFactory.project || '' } };
        
        var getParams = function() {
            return {
                title: $scope.filters.title,
                projectkey: $scope.filters.project.key
            };
        }

        restFactory.get('/issues', getParams()).then(function(data) {
            $scope.issues = data;
            $scope.$apply();
        }).catch(function(err) {
            $scope.issues = [];
        });

        $scope.update = function() {
            restFactory.get('/issues', getParams()).then(function(data) {
                $scope.issues = data;
                $scope.$apply();
            }).catch(function(err) {
                $scope.issues = [];
            });
        };

        $scope.loadProjects = function() {
            return restFactory.get('/projects', {
                name: $scope.filters.project
            }).then(function(data) {
                return data;
            }).catch(function(err) {
                return [];
            });
        }
    }

    IssuesCtrl.$inject = ['$scope', 'userFactory', 'restFactory'];

    angular.module('break').controller('issuesController', IssuesCtrl);
})()
