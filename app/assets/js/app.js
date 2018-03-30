(function(angular) {
    angular.module('break', [
        'ngAnimate',
        'ngSanitize',
        'ui.bootstrap'
    ]);

    angular.module('break')
    .factory('userFactory', ['$q', '$http', '$rootScope', function($q, $http, $rootScope) {
        var deferred = $q.defer();
        $http.get('/user').then(function(data) { deferred.resolve(data); });
        return deferred.promise;
    }])
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
    }])
    .filter('fullname', function() {
        return function(user) {
            if (!user) return '';
            return user.firstname + ' ' + user.lastname;
        }
    });
})(angular)
