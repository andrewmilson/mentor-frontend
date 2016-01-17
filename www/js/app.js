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
  $scope.USER_ID = USER_ID;

  var route = $scope.USER_ID <= 4 ? '/mentors/' : '/mentees/';

  console.log(HOST + route + $scope.USER_ID)
  $http.get(HOST + route + $scope.USER_ID)
  .success(function(mentor) {
    console.log(mentor, "dsakdsajkhdjsa")
    $scope.me = mentor.data;
  });
})

.controller('dashboardController', function($scope, $http) {
  $http.get(HOST + '/mentors/' + 3)
  .success(function(mentor) {
    $scope.mentor = mentor.data;

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
  $scope.revealIdentity = function() {
    vex.dialog.open({
      message: 'You are about to reveal your identity! Are you sure you want to do this?',
      buttons: [
        $.extend({}, vex.dialog.buttons.YES, {
          text: 'Yes!'
        }), $.extend({}, vex.dialog.buttons.NO, {
          text: 'No.'
        })
      ],
      callback: function(data) {
        if (data === false) {
          // User wants to remain anonymous initially

          return console.log('Cancelled');
        }

        $scope.revealed = true;

        // User doesn't mind sharing their identity
        return;
      }
    });
  }

  vex.dialog.open({
    message: 'Do you want to reveal your identity now?',
    buttons: [
      $.extend({}, vex.dialog.buttons.YES, {
        text: 'Yes!'
      }), $.extend({}, vex.dialog.buttons.NO, {
        text: 'No.'
      })
    ],
    callback: function(data) {
      if (data === false) {
        // User wants to remain anonymous initially

        return console.log('Cancelled');
      }

      // User doesn't mind sharing their identity
      return;
    }
  });

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

  console.log($scope.me.username);
  $scope.user = new User($scope.me.username, function(d) {
    console.log(d);
    console.log("NEW MESSAGE!");
    $scope.messages.push(d);
  });

  $scope.sendMessage = function($event) {
    $scope.messages.push($scope.user.sendMessage($scope.to.username, $scope.message));
    console.log($scope.messages);
    $scope.message = "";

    $event.preventDefault();
  };
});
