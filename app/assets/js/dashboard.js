(function Dashboard(angular) {
    angular.module('dashboard', [])
    .controller('issuesController', ['$scope', IssuesCtrl])
    .controller('projectsController', ['$scope', ProjectsCtrl]);
})(angular);
