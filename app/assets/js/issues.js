(function() {
    function IssuesCtrl($scope) {
        var self = this;

        $scope.filters = { title: '', project: '' };
        
        var getParams = function() {
            return {
                title: $scope.filters.title,
                projectkey: $scope.filters.project
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
    }

    angular.module('break').controller('issuesController', ['$scope', IssuesCtrl]);
})()
