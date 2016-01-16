console.log('hey')

angular.module('mentor', [
  'ngSanitize',
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
  })
  .state('discover', {
    url: '/discover',
    templateUrl: 'views/discover.html',
    controller: 'discoverController'
  });
}])

.controller('dashboardController', function($scope, $http) {
  $http.get(HOST + '/mentors/' + 3)
  .success(function(mentor) {
    $scope.mentor = mentor.data;

    console.log($scope.mentor.talking_to);

    $scope.mentor.talking_to.forEach(function(mentorId, index) {
      $http.get(HOST + '/mentee/' + mentorId)
      .success(function(mentee) {
        $scope.mentor.talking_to[index] = mentee;
      })
    })
  });
})

.controller('bioController', function($scope, $http) {
  $http.get(HOST + '/mentors/' + USER_ID)
  .success(function(mentor) {
    console.log(mentor)
    $scope.mentor = mentor.data;
  })
})

.controller('discoverController', function($scope, $http) {
  $http.get(HOST + '/mentors')
  .success(function(mentors) {
    console.log(mentors);
    $scope.mentors = mentors.data;
  })
});
