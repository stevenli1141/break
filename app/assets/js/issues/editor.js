(function() {
    function IssueEditor($scope, $uibModal, restFactory) {
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
            restFactory.get('/users', params).then(function(data) {
                $scope.users = data;
                return data;
            }).catch(function(err) {
                $scope.users = [];
            });
        }

        $scope.userFilter = function(user) {
            var fullname = user.firstname + ' ' + user.lastname;
            return fullname.match(new RegExp($scope._issue.assignee, 'i'));
        }

        restFactory.get('/users').then(function(data) {
            $scope.users = data;
        }).catch(function(err) {
            $scope.users = [];
        });

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
