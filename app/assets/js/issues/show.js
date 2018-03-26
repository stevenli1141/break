(function Issue(angular) {
    angular.module('issue', ['ngAnimate', 'ui.bootstrap'])
    .controller('issueController', ['$scope', '$uibModal', IssueEditor])
    .controller('modalInstController', ['$scope', '$uibModalInstance', modalInstController])
    .filter('formatLabels', function() {
        return function(a) {
            a = a || [];
            var s = '';
            a.forEach(function(e) { s = s + e + ' '; });
            return s;
        }
    });
})(angular);
