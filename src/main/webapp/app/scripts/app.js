'use strict';

/**
 * @ngdoc overview
 * @name nutritionApp
 * @description
 * # nutritionApp
 *
 * Main module of the application.
 */
angular
  .module('nutritionApp', [
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'ui.bootstrap',
    'ngGrid',
    'ngQuickDate',
    'amChartsDirective',
    'nutritionApp.patient_search',
    'nutritionApp.assessment',
    'nutritionApp.reviews',
    'nutritionApp.progressCharts',
    'nutritionApp.summary',
    'nutritionApp.version'
  ])
          .config(['ngQuickDateDefaultsProvider', function(ngQuickDateDefaultsProvider){
              ngQuickDateDefaultsProvider.set({
                         closeButtonHtml: '<i class=\'fa fa-check-circle\'></i>',
    buttonIconHtml: '<i class=\'fa fa-calendar\'></i>',
    nextLinkHtml: '<i class=\'fa fa-chevron-right\'></i>',
    prevLinkHtml: '<i class=\'fa fa-chevron-left\'></i>',
        dateFormat: 'MMM d yyyy',
        timeFormat: 'HH:mm',
        labelFormat: 'EEE MMM dd, yyyy',
    parseDateFunction: (function(str){
        if(str === '')
            str = null;
        return moment(str).isValid() ? moment(str).toDate() : null;
    })
                    });
  }])
   .config(['$stateProvider', '$urlRouterProvider', function( $stateProvider, $urlRouterProvider) {
   $stateProvider
          .state('init',{
              url:'/init/:icuId/:pmiId/:admId/:sex/:age/:user',
              controller: 'InitCtrl'
})
        .state('assessment',{
           url:'/assessment',
            templateUrl:'views/assessment.html',
    controller: 'AssessmentCtrl'
})
.state('reviews',{
           url:'/reviews',
            templateUrl:'views/reviews.html',
    controller: 'ReviewsCtrl'
})
.state('progress_charts',{
           url:'/progress_charts',
            templateUrl:'views/progress_charts.html',
    controller: 'ProgressChartsCtrl'
})
.state('summary',{
           url:'/summary',
            templateUrl:'views/summary.html',
    controller: 'SummaryCtrl'
})
        .state('patient_search',{
            url:'/patient_search',
            templateUrl:'views/patient_search.html',
            controller:'PatientSearchCtrl'
});
$urlRouterProvider.otherwise('/patient_search');
}]).
          factory('NutritionCache', function($cacheFactory){
              return $cacheFactory("NUTRITION");
  }) .factory('ICUPatientFactory', function ($resource) {
            return $resource('/BedManagerWeb/webresources/au.org.alfred.icu.bedmanager.bedmanagerweb.qryicupatients/:id', [], {
                find: {
                    url: '/BedManagerWeb/webresources/au.org.alfred.icu.bedmanager.bedmanagerweb.qryicupatients/icuid/:id',
                    method: 'GET',
                    params: {},
                    isArray: false
                }
            });
        })
        .factory('UserFactory', function ($resource) {
            return $resource('/ICUDischargeSummaryWeb/webresources/au.org.alfred.icu.module.discharge.web.icudischargesummaryweb.vwuser/:id', {}, {
                query: {
                    url: '/ICUDischargeSummaryWeb/webresources/au.org.alfred.icu.module.discharge.web.icudischargesummaryweb.vwuser/userid/:uid',
                    method: 'GET',
                    isArray: true
                },
                all: {
                    url: '/ICUDischargeSummaryWeb/webresources/au.org.alfred.icu.module.discharge.web.icudischargesummaryweb.vwuser',
                    method: 'GET',
                    params: {},
                    isArray: true
                },
                find: {
                    method: 'GET',
                    params: {},
                    isArray: false
                },
                update: {method: 'put', isArray: false}
            });
        })
                .factory('DemoSearchFactory', function ($resource) {
            return $resource('/BedManagerWeb/webresources/au.org.alfred.icu.bedmanager.bedmanagerweb.vwpmidetails/:id', [], {
               find: {
                    url: '/BedManagerWeb/webresources/au.org.alfred.icu.bedmanager.bedmanagerweb.vwpmidetails/ur/:id',
                    method: 'GET',
                    params: {},
                    isArray: true
                },
                findname: {
                    url: '/BedManagerWeb/webresources/au.org.alfred.icu.bedmanager.bedmanagerweb.vwpmidetails/name/:first/:last',
                    method: 'GET',
                    params: {},
                    isArray: true
                },
                findnamecurr: {
                    url: '/BedManagerWeb/webresources/au.org.alfred.icu.bedmanager.bedmanagerweb.vwpmidetails/namecurr/:first/:last',
                    method: 'GET',
                    params: {},
                    isArray: true
                },
                findCurrent: {
                    url: '/BedManagerWeb/webresources/au.org.alfred.icu.bedmanager.bedmanagerweb.vwpmidetails/current/:id',
                    method: 'GET',
                    params: {},
                    isArray: true
                },
                update: {method: 'put', isArray: false}
            });
        })
        
          .factory('PdfFactory', function ($resource) {
            return $resource('/ICUDischargeSummaryWeb/webresources/pdf/nutrition', {}, {
                create: {
                    method: 'PUT',
                    isArray: false
                }
            });
        })
                .factory('SetUpFactory',['$rootScope','PdfFactory','NutritionCache', function($rootScope, PdfFactory,  NutritionCache){
                     return function(){
                         $rootScope.print = {
                    alerts: [],
                    reviews: [],
                    setAlert: (function (type, msg) {
                        var alert = {
                            type: type,
                            msg: msg
                        };
                        this.alerts.push(alert);
                    }),
                    closeAlert: function(index){
                      this.alerts.splice(index);  
                    },
                    save: function () {
                        /*$scope.finalDiag.save();
                         $scope.presenting.save();
                         $scope.past.save();
                         $scope.nicotine.save();
                         $scope.summary.save();
                         $scope.activeProblems.save();
                         $scope.neuro.save();
                         $scope.resus.save();*/
                        var params = {};
                        params["icuid"] = NutritionCache.get("ICUID");
                        params["pmiid"] = "ALF"+NutritionCache.get("PMIID");
                        params["admid"] = NutritionCache.get("ADMID");
                        params["user"] = angular.isDefined(NutritionCache.get("USERDATA")) ? NutritionCache.get("USERDATA").loginName : 'Miguel de Sousa';
                        params["userid"] = angular.isDefined(NutritionCache.get("USERDATA")) ? NutritionCache.get("USERDATA").uid : 760;
                        params["reviews"] = this.reviews;
                        var assessment = {};
                       setParamsForObject(NutritionCache.get("ANP"), assessment);
                       params["assessment"] = assessment;
                       this.setAlert('warning', 'Creating Discharge PDF');
                        var encodedPdf = PdfFactory.create(params, function (data) {
                            console.log(data.fileName);
                            if (typeof (data) !== undefined && data.fileName.indexOf("pdf") > 0) {
                                $rootScope.print.alerts.pop();
                                $rootScope.print.setAlert('success', 'Opening PDF');
                               
                                window.open("../pdf_tmp/" + data.fileName + "?download");
                            }
                            else
                                {
                                    $rootScope.print.alerts.pop();
                                    $rootScope.print.setAlert('danger','Error producing PDF');
                                }
                            //var str = '';
                            //var idx = 0
                            //var dataSize = data.length;
                            //var pdfData = "data:application/pdf;base64,"+data.fileName;
                            //var pdfAsArray = $scope.pdfCreator.convertDataURIToBinary(pdfData);
                            /*PDFJS.getDocument(pdfAsArray).then(function(pdf) {
                             pdf.getPage(1).then(function(page) {
                             var scale = 1.5;
                             var viewport = page.getViewport(scale);
                             
                             //
                             // Prepare canvas using PDF page dimensions
                             //
                             var canvas = document.getElementById('the-canvas');
                             var context = canvas.getContext('2d');
                             canvas.height = viewport.height;
                             canvas.width = viewport.width;
                             
                             //
                             // Render PDF page into canvas context
                             //
                             var renderContext = {
                             canvasContext: context,
                             viewport: viewport
                             };
                             page.render(renderContext);
                             });
                             });*/
                        });

                    }
                };
                     };
        }])
        .controller('InitCtrl', 
        ['$stateParams',
            '$rootScope',
            '$location',
            'NutritionCache',
            'DemoSearchFactory',
            'UserFactory',
            'SetUpFactory',
            function ($stateParams, $rootScope, $location, NutritionCache, DemoSearchFactory, UserFactory, SetUpFactory) {
                //console.log($stateParams.age);

                var icuId = $stateParams.icuId;
                var pmiId = $stateParams.pmiId;
                var admId = $stateParams.admId;
                var sex = $stateParams.sex;
                var age = parseInt($stateParams.age);
                var user = $stateParams.user;
                SetUpFactory();
               
                $rootScope.userDetails = '';
                $rootScope.bedDetails = {};
                
                NutritionCache.put("ICUID", pmiId);
                NutritionCache.put("PMIID", pmiId);
                NutritionCache.put("ADMID", admId);
                NutritionCache.put("ORIGICUID", icuId);
                NutritionCache.put("AGE", age);
                NutritionCache.put("SEX", sex);
                NutritionCache.put("USER", "N/A");
                DemoSearchFactory.find({id: pmiId, cacheSlayer: new moment()}, function (demoFactory) {
                    angular.forEach(demoFactory, function (demo) {
                        demo.birthDate = moment(demo.birthDate).format("DD/MM/YYYY");
                        $rootScope.bedDetails = demo;
                    });
                });
                UserFactory.query({uid: user}, function (usr) {
                    angular.forEach(usr, function (id) {
                        NutritionCache.put("USERNAME", id.loginName);
                        NutritionCache.put("USERDATA", id);
                        $rootScope.icuActiveUrl = $rootScope.icuActiveUrl.concat("?user=" + id.loginID);
                        $rootScope.userDetails = id.loginName;
                    });
                });
                $location.path('/assessment');
                if (angular.isDefined(NutritionCache.get("USERDATA")))
                    $rootScope.icuActiveUrl = "http://ac-webapps01/icu/patient/demographic/?ICUAdmID=" + icuId + "&AdmID=" + admId + "&PMIID=" + pmiId;
                else
                    $rootScope.icuActiveUrl = "http://ac-webapps01/icu/";


            }])
        ;


