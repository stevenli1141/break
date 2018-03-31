(function() {
    function DashboardCtrl($scope, userFactory, restFactory) {
        restFactory.get('/user').then(function(user) {
            $scope.user = user;
            return restFactory.get('/issues', { assigned: user._id });
        }).then(function(data) {
            $scope.issues = data;
            $scope.$apply();
        });

        restFactory.get('/projects').then(function(data) {
            $scope.projects = data;
            $scope.$apply();
        });
    }

    DashboardCtrl.$inject = ['$scope', 'userFactory', 'restFactory'];

    angular.module('break').controller('dashboardController', DashboardCtrl);
})()
