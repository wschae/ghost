angular.module('app', []);
angular.module('app').controller('myCtrl', function($scope, $http) {
    $scope.isAvailable = false;
    $scope.verify = function() {
        // name >= 5
        $scope.isAvailable = $scope.name.length >= 5;
    };
    $scope.create = function() {
        $http.post('/api/setup', {name:$scope.name})
            .success(function(data) {
                console.log(data.redirect);
                window.location = data.redirect;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }
});