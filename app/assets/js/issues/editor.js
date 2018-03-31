(function() {
    function IssueEditor($scope, $uibModal, restFactory) {
        var resolutions = {
            'Planning': 'Start Progress',
            'In Progress': 'Resolve',
            'Resolved': 'Promote',
            'Promoted': 'Close',
            'Closed': 'Reopen'
        };

        var next_status = {
            'Planning': 'In Progress',
            'In Progress': 'Resolved',
            'Resolved': 'Promoted',
            'Promoted': 'Closed',
            'Closed': 'Planning'
        };

        $scope.issue = {};
        
        restFactory.get(window.location.pathname).then(function(data) {
            $scope.issue = data;
            $scope.$apply();
        }).catch(function(err) {
            $scope.issue = {};
        });

        $scope.loadUsers = function() {
            restFactory.get('/users').then(function(data) {
                return data;
            }).catch(function(err) {
                return [];
            });
        }

        $scope.nextStatus = function() {
            return resolutions[$scope.issue.status];
        }

        $scope.advance = function() {
            $scope.issue.status = next_status[$scope.issue.status];
            restFactory.put(window.location.pathname, $scope.issue).then(function(data) {
                $scope.issue = data;
                $scope.$apply;
            });
        }

        $scope.open = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'modal.html',
                controller: 'modalInstController',
                scope: $scope,
                size: 'lg',
                resolve: {
                    issue: function() {
                        return $scope._issue;
                    }
                }
            });

            modalInstance.result.then(function(issue) {
                issue.assignee_id = issue.assignee._id;
                restFactory.put(window.location.pathname, issue).then(function(data) {
                    $scope.issue = data;
                    $scope.$apply();
                }).catch(function(err) {
                    console.log(err);
                    // TODO Notify error
                });
            }, function() {});
        };
    }

    IssueEditor.$inject = ['$scope', '$uibModal', 'restFactory'];

    function modalInstController($scope, $uibModalInstance, restFactory, issue) {
        $scope._issue = Object.assign({}, $scope.issue);
        
        $scope.loadUsers = function() {
            var params = { name: $scope._issue.assignee };
            return restFactory.get('/users', params).then(function(data) {
                return $scope.users = data;
            }).catch(function(err) {
                return $scope.users = [];
            });
        }

        $scope.userFilter = function(user) {
            var fullname = user.firstname + ' ' + user.lastname;
            return fullname.match(new RegExp($scope._issue.assignee, 'i'));
        }

        $scope.update = function() {
            $uibModalInstance.close($scope._issue);
        }
    
        $scope.close = function() {
            $uibModalInstance.dismiss('cancel');
        }
    }

    modalInstController.$inject = ['$scope', '$uibModalInstance', 'restFactory'];

    angular.module('break')
    .controller('issueController', IssueEditor)
    .controller('modalInstController', modalInstController);
})()
