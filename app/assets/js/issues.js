(function() {
    function IssuesCtrl($scope) {
        $scope.issues = [];
        var getIssues = new Promise(function(resolve, reject) {
            $.ajax({
                url: '/issues',
                method: 'GET',
                dataType: 'json',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-CSRF-Token', AUTH_TOKEN);
                },
                success: function(data) { resolve(data); },
                error: function(err) { reject(err); }
            });
        });

        getIssues.then(function(data) {
            $scope.issues = data;
            $scope.$apply();
        }).catch(function(err) {
            $scope.issues = [];
        });

        $scope.update = function() {
            getIssues.then(function(data) {
                $scope.issues = data;
                $scope.$apply();
            }).catch(function(err) {
                $scope.issues = [];
            });
        };
    }

    angular.module('break').controller('issuesController', ['$scope', IssuesCtrl]);
})()
