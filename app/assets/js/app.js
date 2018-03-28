(function(angular) {
    angular.module('break', [
        'ngAnimate',
        'ngSanitize',
        'ui.bootstrap'
    ]);

    angular.module('break')
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
})(angular)
