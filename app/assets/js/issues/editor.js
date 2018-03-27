function IssueEditor($scope, $uibModal) {
    $scope.issue = {};

    var getIssue = new Promise(function(resolve, reject) {
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

    var updateIssue = function(issue) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: window.location.pathname,
                method: 'PUT',
                data: issue,
                dataType: 'json',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-CSRF-Token', AUTH_TOKEN);
                },
                success: function(data) { resolve(data); },
                error: function(err) { reject(err); }
            });
        });
    };
    
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
                    return $scope._issue;
                }
            }
        });

        modalInstance.result.then(function(issue) {
            updateIssue(issue).then(function(data) {
                $scope.issue = data;
            }).catch(function(err) {
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
