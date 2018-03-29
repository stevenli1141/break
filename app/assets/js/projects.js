(function() {
    function ProjectsCtrl($scope) {
        var getProjects = new Promise(function(resolve, reject) {
            $.ajax({
                url: '/projects',
                method: 'GET',
                dataType: 'json',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-CSRF-Token', AUTH_TOKEN);
                },
                success: function(data) { resolve(data); },
                error: function(err) { reject(err); }
            });
        });

        

        getProjects.then(function(data) {
            $scope.projects = data;
            $scope.$apply();
        }).catch(function(err) {
            $scope.projects = [];
        });

        $scope.update = function() {
            getProjects.then(function(data) {
                $scope.projects = data;
                $scope.$apply();
            }).catch(function(err) {
                $scope.projects = [];
            });
        };
    }

    angular.module('break').controller('projectsController', ['$scope', ProjectsCtrl]);
})()
