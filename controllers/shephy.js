angular.module('ShephyApp',['ui.router', 'ui.materialize']);

angular.module('ShephyApp').controller('ShephyCtrl', ['$scope', function($scope){
    $scope.app = "shephy";
}]);