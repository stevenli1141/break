(function() {
    function IssuesCtrl($scope, user) {
        var self = this;

        $scope.filters = { title: '', project: { key: user.project || '' } };
        
        var getParams = function() {
            return {
                title: $scope.filters.title,
                projectkey: $scope.filters.project.key
            };
        }

        var getIssues = function() {
            return new Promise(function(resolve, reject) {
                $.ajax({
                    url: '/issues',
                    method: 'GET',
                    data: getParams(),
                    dataType: 'json',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('X-CSRF-Token', AUTH_TOKEN);
                    },
                    success: function(data) { resolve(data); },
                    error: function(err) { reject(err); }
                });
            });
        };

        var getProjects = function() {
            return new Promise(function(resolve, reject) {
                $.ajax({
                    url: '/projects',
                    method: 'GET',
                    data: { name: $scope.filters.project },
                    dataType: 'json',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('X-CSRF-Token', AUTH_TOKEN);
                    },
                    success: function(data) { resolve(data); },
                    error: function(err) { reject(err); }
                });
            });
        }

        getIssues().then(function(data) {
            $scope.issues = data;
            $scope.$apply();
        }).catch(function(err) {
            $scope.issues = [];
        });

        $scope.update = function() {
            getIssues().then(function(data) {
                $scope.issues = data;
                $scope.$apply();
            }).catch(function(err) {
                $scope.issues = [];
            });
        };

        $scope.loadProjects = function() {
            return getProjects().then(function(data) {
                return data;
            }).catch(function(err) {
                return [];
            });
        }
    }

    IssuesCtrl.$inject = ['$scope', 'userFactory'];

    angular.module('break').controller('issuesController', IssuesCtrl);
})()
