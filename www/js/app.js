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
    url: '/chat/:id',
    templateUrl: 'views/chat.html',
    controller: 'chatController'
  })
  .state('discover', {
    url: '/discover',
    templateUrl: 'views/discover.html',
    controller: 'discoverController'
  });
}])

.controller('homeController', function($scope, $http) {
  $scope.USER_ID = parseInt(prompt("What ID would you like to use?"));

  var route = $scope.USER_ID < 4 ? '/mentors/' : '/mentees/';
  $http.get(HOST + route + $scope.USER_ID)
  .success(function(mentor) {
    $scope.me = mentor.data;
  });
})

.controller('dashboardController', function($scope, $http) {
  $http.get(HOST + '/mentors/' + 3)
  .success(function(mentor) {
    $scope.mentor = mentor.data;

    console.log($scope.mentor.talking_to);

    $scope.mentor.talking_to.forEach(function(mentorId, index) {
      $http.get(HOST + '/mentees/' + mentorId)
      .success(function(mentee) {
        $scope.mentor.talking_to[index] = mentee.data;
      })
    })
  });
})

.controller('bioController', function($scope, $http) {
  var route = $scope.USER_ID < 4 ? '/mentors/' : '/mentees/';
  $http.get(HOST + route + $scope.USER_ID)
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
})

.controller('chatController', function($scope, $http, $stateParams) {
  $scope.muted = true;
  $scope.messages = [];

  console.log(parseInt($stateParams.id));

  var route = parseInt($stateParams.id) < 4 ? '/mentors/' : '/mentees/';
  console.log(route);
  // only works if the ID is a mentor :')
  $http.get(HOST + route + $stateParams.id)
    .success(function(mentor) {
      $scope.to = mentor.data;
    });

  $scope.user = new User($scope.me.username, function(d) {
    console.log(d);
    console.log("NEW MESSAGE!");
    $scope.messages.push(d);
  });

  $scope.sendMessage = function() {
    $scope.user.sendMessage($scope.to.username, $scope.message);
  };
});
