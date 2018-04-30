(function() {
    function projectBoard($scope, $uibModal, restFactory) {
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

        $scope.showIssue = function(issue) {
            $scope.issue = issue;
            var modalInstance = $uibModal.open({
                templateUrl: 'modal.html',
                controller: 'projectBoardModalController',
                scope: $scope,
                size: 'lg'
            });

            modalInstance.result.then(function() {}, function() {});
        }

        restFactory.get(window.location.pathname).then(function(data) {
            $scope.project = data;
            $scope.$apply();
        }).then(function() {
            $scope.loadIssues();
        });       
    };

    projectBoard.$inject = ['$scope', '$uibModal', 'restFactory'];

    function boardModalController($scope, $uibModalInstance) {
        console.log($scope.issue);

        $scope.close = function() {
            $uibModalInstance.dismiss('cancel');
        }
    }

    boardModalController.$inject = ['$scope', '$uibModalInstance'];

    angular.module('break')
    .controller('projectBoardController', projectBoard)
    .controller('projectBoardModalController', boardModalController);
})();
