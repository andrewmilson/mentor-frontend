console.log('hey')

angular.module('mentor', [
  'ui.router'
])

.config(
['$stateProvider', '$urlRouterProvider', '$compileProvider',
function($stateProvider, $urlRouterProvider, $compileProvider) {
  $urlRouterProvider.otherwise('/');
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|geo|file|maps):/);

  $stateProvider
  .state('dashboard', {
    url: '/',
    templateUrl: 'views/dashboard.html',
    controller: 'dashboardController'
  })
  .state('bio', {
    url: '/bio',
    templateUrl: 'views/bio.html',
    controller: 'bioController'
  })
  .state('chat', {
    url: '/chat/:menteeId/:mentorId',
    templateUrl: 'views/chat.html',
    controller: 'chatController'
  });
}])

.controller('dashboardController', function($scope) {
  $http.get('/mentors/' + mentor.id)
  .success(function(contacts) {

  });
})

.controller('bioController', function($scope) {
  $scope.get('/mentors/' + USER_ID)
  .success(function(mentor) {
    $scope.mentor = mentor;
  })
});
