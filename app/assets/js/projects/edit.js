(function() {
    function ProjectCtrl($scope, $uibModal, restFactory) {
        restFactory.get(window.location.pathname).then(function(data) {
            console.log(data);
            $scope.project = data;
            $scope.$apply();
        }).catch(function(err) {
            // TODO Handle error
        });

        $scope.open = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'projectModal.html',
                controller: 'projectModalController',
                scope: $scope,
                size: 'lg',
                resolve: {
                    result: function() {
                        return $scope._project;
                    }
                }
            });

            modalInstance.result.then(function(project) {
                restFactory.put('/projects/' + project.key, project).then(function(data) {
                    $scope.project = data;
                    $scope.$apply();
                }).catch(function(err) {
                    // TODO Handle error
                });
            }, function() {});
        };
    }

    ProjectCtrl.$inject = ['$scope', '$uibModal', 'restFactory'];

    function ProjectModalCtrl($scope, $uibModalInstance, restFactory, project) {
        $scope._project = Object.assign({}, $scope.project);
        
        $scope.loadUsers = function() {
            var params = { name: $scope._project.lead };
            return restFactory.get('/users', params).then(function(data) {
                return $scope.users = data;
            }).catch(function(err) {
                return $scope.users = [];
            });
        }

        $scope.userFilter = function(user) {
            var fullname = user.firstname + ' ' + user.lastname;
            return fullname.match(new RegExp($scope._project.lead, 'i'));
        }

        $scope.update = function() {
            $uibModalInstance.close($scope._project);
        }
    
        $scope.close = function() {
            $uibModalInstance.dismiss('cancel');
        }
    }

    ProjectModalCtrl.$inject = ['$scope', '$uibModalInstance', 'restFactory'];

    angular.module('break')
    .controller('projectController', ProjectCtrl)
    .controller('projectModalController', ProjectModalCtrl);
})()
