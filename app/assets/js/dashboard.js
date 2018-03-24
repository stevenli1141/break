function Dashboard($scope) {
    $scope.projects = [];
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

    getJSON('/projects').then(function(data) {
        $scope.projects = data;
        $scope.$apply();
    }).catch(function(err) {
        $scope.projects = [];
    });

    $scope.update = function() {
        getJSON('/projects').then(function(data) {
            $scope.projects = data;
            $scope.$apply();
        }).catch(function(err) {
            $scope.projects = [];
        });
    };

}
