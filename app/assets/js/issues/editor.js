(function() {
    function IssueEditor($scope, $uibModal, restFactory) {
        $scope.issue = {};
        
        restFactory.get(window.location.pathname).then(function(data) {
            $scope.issue = data;
            $scope.$apply();
        }).catch(function(err) {
            $scope.issue = {};
        });

        var update = function(params) {
            return new Promise(function(resolve, reject) {
                $.ajax({
                    url: window.location.pathname,
                    method: 'PUT',
                    data: params,
                    dataType: 'json',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('X-CSRF-Token', AUTH_TOKEN);
                    },
                    success: function(data) { resolve(data); },
                    error: function(err) { reject(err); }
                });
            });
        };

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

    function modalInstController($scope, $uibModalInstance, issue) {
        $scope._issue = Object.assign({}, $scope.issue);
        $scope.update = function() {
            $uibModalInstance.close($scope._issue);
        }
    
        $scope.close = function() {
            $uibModalInstance.dismiss('cancel');
        }
    }

    IssueEditor.$inject = ['$scope', '$uibModal', 'restFactory'];

    angular.module('break')
    .controller('issueController', IssueEditor)
    .controller('modalInstController', ['$scope', '$uibModalInstance', modalInstController]);
    
})()
