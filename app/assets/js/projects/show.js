(function() {
    function projectBoard($scope, restFactory) {
        $scope.statuses = ['Planning', 'In Progress', 'Resolved', 'Promoted', 'Closed'];
        $scope.issues = [];
        $scope.project = { projectKey: '' };

        

        $scope.loadIssues = function() {
            return restFactory.get('/issues', { projectkey: $scope.project.key }).then(function(data) {
                $scope.issues = data;
                $scope.$apply();
            }).catch(function(err) {
                $scope.issue = [];
                $scope.$apply();
            });
        }

        restFactory.get(window.location.pathname).then(function(data) {
            $scope.project = data;
            $scope.$apply();
        }).then(function() {
            $scope.loadIssues();
        });
        
    };

    projectBoard.$inject = ['$scope', 'restFactory'];

    angular.module('break').controller('projectBoardController', projectBoard);
})();
