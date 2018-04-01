(function() {
    function ProjectCtrl($scope, $uibModal, restFactory) {
        restFactory.get(window.location.pathname).then(function(data) {
            $scope.project = data;
            $scope.$apply();
            return restFactory.get('/users', { project: $scope.project._id });
        }).then(function(data) {
            $scope.users = data;
            $scope.$apply();
        }).catch(function(err) {
            // TODO Handle error
        });

        $scope.loadProjectUsers = function() {
            restFactory.get('/users', { project: $scope.project._id }).then(function(data) {
                $scope.users = data;
                $scope.$apply();
            }).catch(function(err) {
                $scope.users = [];
                $scope.$apply();
            });
        }

        $scope.removeUser = function(user_id) {
            restFactory.put('/users/' + user_id, { removeProject: $scope.project._id }).then(function(data) {
                $scope.loadProjectUsers();
                alert('User has been removed');
            }).catch(function(err) {
                alert('You cannot remove yourself');
            });
        }

        $scope.openProjectModal = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'projectModal.html',
                controller: 'projectModalController',
                scope: $scope,
                resolve: {
                    result: function() {
                        return $scope._project;
                    }
                }
            });

            modalInstance.result.then(function(project) {
                restFactory.put('/projects/' + project._id, project).then(function(data) {
                    $scope.project = data;
                    $scope.$apply();
                    $scope.loadProjectUsers();
                }).catch(function(err) {
                    // TODO Handle error
                });
            }, function() {});
        };

        $scope.openUserModal = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'userModal.html',
                controller: 'userModalController',
                scope: $scope,
                resolve: {
                    result: function() {
                        return $scope._user;
                    }
                }
            });

            modalInstance.result.then(function(user) {
                restFactory.put('/users/' + user._id, { addProject: $scope.project._id }).then(function(data) {
                    $scope.loadProjectUsers();
                }).catch(function(err) {
                    // TODO Handle error
                });
            }, function() {});
        }
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

    function UserModalCtrl($scope, $uibModalInstance, restFactory, project) {
        $scope.loadUsers = function(value) {
            return restFactory.get('/users', { name: value }).then(function(data) {
                return data;
            }).catch(function(err) {
                return [];
            });
        }

        $scope.userFilter = function(user) {
            var fullname = user.firstname + ' ' + user.lastname;
            return fullname.match(new RegExp($scope._user, 'i'));
        }

        $scope.update = function() {
            $uibModalInstance.close($scope._user);
        }

        $scope.close = function() {
            $uibModalInstance.dismiss('cancel');
        }
    }

    UserModalCtrl.$inject = ['$scope', '$uibModalInstance', 'restFactory'];

    angular.module('break')
    .controller('projectController', ProjectCtrl)
    .controller('projectModalController', ProjectModalCtrl)
    .controller('userModalController', UserModalCtrl);
})()
