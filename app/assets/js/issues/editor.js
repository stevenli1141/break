function IssueEditor($scope, opts = {}) {
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
}
