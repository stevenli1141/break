(function() {
    function UserCtrl($scope, restFactory) {
        $scope.user = {};
        $scope.current_user = {};
        $scope.activities = [];

        restFactory.get('/user').then(function(u) {
            $scope.current_user = u;
            console.log(u);
            $scope.$apply();
        });

        $scope.admin = function() {
            return $scope.current_user.admin;
        }

        $scope.loadProjects = function() {
            return restFactory.get('/projects', { name: $scope.project }).then(function(data) {
                return data;
            }).catch(function(err) {
                return [];
            });
        }
        
        $scope.addUserToProject = function(project) {
            console.log(project);
            restFactory.put(window.location.pathname, { addProject: project._id }).then(function(data) {
                $scope.user = data;
                $scope.$apply();
            }).catch(function(err) {
                console.log(err);
            });
        }

        $scope.loadActivity = function() {
            restFactory.get('/activities', { user: $scope.user._id }).then(function(data) {
                $scope.activities = data;
                $scope.$apply();
            }).catch(function(err) {
                console.log('Failed to load activity');
            });
        }

        restFactory.get(window.location.pathname).then(function(user) {
            $scope.user = user;
            $scope.$apply();
            $scope.loadActivity();
        }).catch(function(err) {
            console.log(err);
        });
    }

    UserCtrl.$inject = ['$scope', 'restFactory'];

    angular.module('break').controller('userController', UserCtrl);
})()
