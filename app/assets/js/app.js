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
    .factory('restFactory', function() {
        return {
            get: function(url, params) {
                params = params || {};
                return new Promise(function(resolve, reject) {
                    $.ajax({
                        url: url,
                        method: 'GET',
                        data: params,
                        dataType: 'json',
                        beforeSend: function(xhr) {
                            xhr.setRequestHeader('X-CSRF-Token', AUTH_TOKEN);
                        },
                        success: function(data) { resolve(data); },
                        error: function(err) { reject(err); }
                    });
                });
            },
            post: function(url, data) {
                data = data || {};
                return new Promise(function(resolve, reject) {
                    $.ajax({
                        url: url,
                        method: 'POST',
                        data: data,
                        dataType: 'json',
                        beforeSend: function(xhr) {
                            xhr.setRequestHeader('X-CSRF-Token', AUTH_TOKEN);
                        },
                        success: function(data) { resolve(data); },
                        error: function(err) { reject(err); }
                    });
                });
            },
            put: function(url, data) {
                data = data || {};
                return new Promise(function(resolve, reject) {
                    $.ajax({
                        url: url,
                        method: 'PUT',
                        data: data,
                        dataType: 'json',
                        beforeSend: function(xhr) {
                            xhr.setRequestHeader('X-CSRF-Token', AUTH_TOKEN);
                        },
                        success: function(data) { resolve(data); },
                        error: function(err) { reject(err); }
                    });
                });
            }
        };
    })
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
            var converter = new showdown.Converter({ tables: true });
            var text = converter.makeHtml(text || '');
            return text.replace('<table>', '<table class="table table-bordered">');
        }
    }])
    .filter('fullname', function() {
        return function(user) {
            if (!user) return '';
            return user.firstname + ' ' + user.lastname;
        }
    })
    .filter('initials', function() {
        return function(user) {
            if (!user) return '';
            return user.firstname[0] + user.lastname[0];
        }
    }).filter('cssclass', function() {
        return function(text) {
            text = text || '';
            return text.toLowerCase().replace(' ', '-');
        }
    });
})(angular)
