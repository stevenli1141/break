function IssueEditor($scope, $uibModal) {
    $scope.issue = {};

    let getIssue = new Promise(function(resolve, reject) {
        $.ajax({
            url: window.location.pathname,
            method: 'GET',
            dataType: 'json',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-CSRF-Token', AUTH_TOKEN);
            },
            success: function(data) { resolve(data); },
            error: function(err) { reject(err); }
        });
    });
    
    getIssue.then(function(data) {
        data.sprint = {};
        $scope.issue = data;
        $scope.$apply();
    }).catch(function(err) {
        $scope.issue = {};
    });

    $scope.open = function() {
        var modalInstance = $uibModal.open({
            templateUrl: 'modal.html',
            controller: 'modalInstController',
            scope: $scope,
            resolve: {
                issue: function() {
                    return $scope.issue;
                }
            }
        });

        modalInstance.result.then(function(issue) {
            $scope.issue = issue;
        }, function() {});
    };
}

function modalInstController($scope, $uibModalInstance, issue) {
    $scope.update = function() {
        $uibModalInstance.close($scope.issue);
    }

    $scope.close = function() {
        $uibModalInstance.dismiss('cancel');
    }
}
