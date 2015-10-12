'use strict';

angular.module('nutritionApp.summary', [])
        .controller('SummaryCtrl',
                ['$scope', '$location', 'NutritionCache',
                    function ($scope, $location, NutritionCache) {
                        //                    function ($scope, $location, NutritionCache) {

                        $scope.summary = {
                            onLoad: function(){
                                setupSummaryView();
                            }
                        };
                    
                    $scope.summary.onLoad();
                }
                ]);