function Dashboard($scope) {
    $scope.projects = [];
    $scope.issues = [];

    var getJSON = function(url) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json',
                beforeSend: (xhr) => {
                    xhr.setRequestHeader('X-CSRF-Token', AUTH_TOKEN);
                },
                success: (data) => { resolve(data); },
                error: (err) => { reject(err); }
            });
        });
    }

    $scope.update = function() {
        //
    };

    getJSON('/projects').then((projects) => {
        $scope.projects = projects;
    }).catch((err) => {
        $scope.projects = [];
    });
}
