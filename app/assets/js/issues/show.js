(function Issue(angular) {
    angular.module('issue', ['ngAnimate', 'ngSanitize', 'ui.bootstrap'])
    .controller('issueController', ['$scope', '$uibModal', IssueEditor])
    .controller('modalInstController', ['$scope', '$uibModalInstance', modalInstController])
    .filter('formatLabels', function() {
        return function(a) {
            a = a || [];
            var s = '';
            a.forEach(function(e) { s = s + e + ' '; });
            return s;
        }
    })
    .filter('markdown', ['$sce', function($sce) {
        return function(text) {
            var converter = new showdown.Converter();
            return converter.makeHtml(text || '');
        }
    }]);
})(angular);
