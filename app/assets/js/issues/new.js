(function() {
    function IssuesFormCtrl($scope, restFactory) {
        $scope.loadUsers = function() {
            return restFactory.get('/users', { name: $scope.assignee }).then(function(data) {
                return $scope.users = data;
            }).catch(function(err) {
                return $scope.users = [];
            });
        }
        
        $scope.loadProjects = function(value) {
            return restFactory.get('/projects', { name: value }).then(function(data) {
                return data;
            }).catch(function(err) {
                return [];
            });
        }

        $scope.loadIssues = function(value) {
            return restFactory.get('/issues', { key: value, title: value, limit: 6 }).then(function(data) {
                return data;
            }).catch(function(err) {
                return [];
            });
        }

        $scope.userFilter = function(user) {
            var fullname = user.firstname + ' ' + user.lastname;
            return fullname.match(new RegExp($scope.assignee, 'i'));
        }
    }

    IssuesFormCtrl.$inject = ['$scope', 'restFactory'];

    angular.module('break').controller('issuesFormController', IssuesFormCtrl);
})()
