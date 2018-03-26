function UsersCtrl($scope, opts) {
    this.opts = opts || {};
    
    $scope.users = [];
    var getJSON = function(url) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-CSRF-Token', AUTH_TOKEN);
                },
                success: function(data) { resolve(data); },
                error: function(err) { reject(err); }
            });
        });
    }

    getJSON('/users').then(function(data) {
        $scope.users = data;
        $scope.$apply();
    }).catch(function(err) {
        $scope.users = [];
    });

    $scope.update = function() {
        getJSON('/users').then(function(data) {
            $scope.projects = data;
            $scope.$apply();
        }).catch(function(err) {
            $scope.projects = []
            $scope.$apply();
        });
    };
}

(function Admin(angular) {
    angular.module('admin', [])
    .controller('projectsController', ['$scope', ProjectsCtrl])
    .controller('usersController', ['$scope', UsersCtrl]);
    
})(angular);
