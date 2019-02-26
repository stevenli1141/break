(function() {
    function IssuesCtrl($scope, restFactory) {
        var self = this;

        $scope.filters = { title: '', project: { key: '' } };
        
        var getParams = function() {
            return {
                title: $scope.filters.title,
                projectkey: $scope.filters.project.key,
                openOnly: $scope.filters.openOnly,
                assigned: $scope.filters.assigned
            };
        }

        restFactory.get('/user', { projects: true }).then(function(user) {
            if (user.projects.length) {
                let idx = 0;
                
                let key = location.search.split('project=')[1];
                if (key) {
                    for (let i = 0; i < user.projects.length; ++i) {
                        if (user.projects[i].key == key) {
                            idx = i;
                            break;
                        }
                    }
                    $scope.filters.project = user.projects[idx];
                }
                else {   
                    $scope.filters.project = user.projects[0];
                }
                $scope.$apply();
            }
            return restFactory.get('/issues', getParams());
        }).then(function(data) {
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
            return restFactory.get('/projects', { name: $scope.filters.project }).then(function(data) {
                return data;
            }).catch(function(err) {
                return [];
            });
        }
    }

    IssuesCtrl.$inject = ['$scope', 'restFactory'];

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

        $scope.userFilter = function(user) {
            var fullname = user.firstname + ' ' + user.lastname;
            return fullname.match(new RegExp($scope.assignee, 'i'));
        }
    }

    IssuesFormCtrl.$inject = ['$scope', 'restFactory'];

    angular.module('break')
    .controller('issuesController', IssuesCtrl);
})()
