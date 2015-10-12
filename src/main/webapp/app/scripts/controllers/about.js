'use strict';

/**
 * @ngdoc function
 * @name nutritionApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the nutritionApp
 */
angular.module('nutritionApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
