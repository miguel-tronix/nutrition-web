'use strict';

angular.module('nutritionApp.patient_search', ['ngGrid'])


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


        .factory('PatientSearchFactory', function ($resource) {
            return $resource('/BedManagerWeb/webresources/au.org.alfred.icu.bedmanager.bedmanagerweb.qrypmi/:id', [], {
                find: {
                    url: '/BedManagerWeb/webresources/au.org.alfred.icu.bedmanager.bedmanagerweb.qrypmi/ur/:id',
                    method: 'GET',
                    params: {},
                    isArray: true
                },
                findname: {
                    url: '/BedManagerWeb/webresources/au.org.alfred.icu.bedmanager.bedmanagerweb.qrypmi/name/:first/:last',
                    method: 'GET',
                    params: {},
                    isArray: true
                },
                findnamecurr: {
                    url: '/BedManagerWeb/webresources/au.org.alfred.icu.bedmanager.bedmanagerweb.qrypmi/namecurr/:first/:last',
                    method: 'GET',
                    params: {},
                    isArray: true
                },
                findCurrent: {
                    url: '/BedManagerWeb/webresources/au.org.alfred.icu.bedmanager.bedmanagerweb.qrypmi/current/:id',
                    method: 'GET',
                    params: {},
                    isArray: true
                },
                discharges: {
                    url: '/BedManagerWeb/webresources/au.org.alfred.icu.bedmanager.bedmanagerweb.qrypmi/discharges/:start/:end',
                    method: 'GET',
                    params: {},
                    isArray: true
                },
                update: {method: 'put', isArray: false}
            });
        })

        .factory('HospPatientSearchFactory', function ($resource) {
            return $resource('/BedManagerWeb/webresources/au.org.alfred.icu.bedmanager.bedmanagerweb.qryhosppmi/:id', [], {
                find: {
                    url: '/BedManagerWeb/webresources/au.org.alfred.icu.bedmanager.bedmanagerweb.qryhosppmi/ur/:id',
                    method: 'GET',
                    params: {},
                    isArray: true
                },
                findAdms: {
                    url: '/BedManagerWeb/webresources/au.org.alfred.icu.bedmanager.bedmanagerweb.qryhosppmi/adms/:id',
                    method: 'GET',
                    params: {},
                    isArray: true
                },
                findname: {
                    url: '/BedManagerWeb/webresources/au.org.alfred.icu.bedmanager.bedmanagerweb.qryhosppmi/name/:first/:last',
                    method: 'GET',
                    params: {},
                    isArray: true
                },
                findnamecurr: {
                    url: '/BedManagerWeb/webresources/au.org.alfred.icu.bedmanager.bedmanagerweb.qryhosppmi/namecurr/:first/:last',
                    method: 'GET',
                    params: {},
                    isArray: true
                },
                findCurrent: {
                    url: '/BedManagerWeb/webresources/au.org.alfred.icu.bedmanager.bedmanagerweb.qryhosppmi/current/:id',
                    method: 'GET',
                    params: {},
                    isArray: true
                },
                update: {method: 'put', isArray: false}
            });
        })
        .factory('HospAdmFactory', function ($resource) {
            return $resource('/BedManagerWeb/webresources/au.org.alfred.icu.bedmanager.bedmanagerweb.tbladmission/:id', [], {
                find: {
                    url: '/BedManagerWeb/webresources/au.org.alfred.icu.bedmanager.bedmanagerweb.tbladmission/adm/:id',
                    method: 'GET',
                    params: {},
                    isArray: false
                },
              remove: {
                    method: 'delete',
                    isArray: false},
                update: {method: 'put', isArray: false}
            });
        })
        .controller('PatientSearchCtrl',
                ['$rootScope','$scope', '$location', 'NutritionCache', 'PatientSearchFactory', 'HospPatientSearchFactory', 'DemoSearchFactory', 'HospAdmFactory', 'SetUpFactory',
            function ($rootScope, $scope, $location, NutritionCache, PatientSearchFactory, HospPatientSearchFactory, DemoSearchFactory, HospAdmFactory, SetUpFactory) {

                $scope.search = {
                    searchNotSet: (NutritionCache.get("SEARCHSET") === undefined ? true : false),
                    searchView: (NutritionCache.get("SEARCHSET") === undefined ? '' : NutritionCache.get("SEARCHSET")),
                    setSearchView: (function (view) {
                        this.searchView = view;
                        NutritionCache.put("SEARCHSET", view);
                        if (view === 'HOSP') {
                            $scope.search.hosp.show = true;
                            $scope.search.patient.show = false;
                            $scope.search.patient.showgrid = false;
                            this.searchNotSet = false;
                        }
                        else if (view === 'PATIENT') {
                            $scope.search.hosp.show = false;
                            $scope.search.hosp.showgrid = false;
                            $scope.search.patient.show = true;
                            $scope.search.patient.showgrid = false;
                            this.searchNotSet = false;
                        }
                    }),
                    nutrition:{
                      pmiid:'',
                      admid:'',
                      age:'',
                      gender:'',
                      icuadmid:'',
                      goToAssessment:(function(){
                          console.log("load nutrition "+this.admid);
                          NutritionCache.put("PMIID",this.pmiid);
                          NutritionCache.put("ADMID", this.admid);
                          NutritionCache.put("ICUADMID",this.pmiid);
                          NutritionCache.put("AGE",this.age);
                          NutritionCache.put("SEX",this.gender);
                          NutritionCache.put("ORIGICUADMID",this.icuadmid)
                          $rootScope.bedDetails = this.patient;
                          $location.path("/assessment");
                      })
                    },
                    hosp: {
                        loading: false,
                        show: (NutritionCache.get("SEARCHSET") === undefined ? false : (NutritionCache.get("SEARCHSET") === "HOSP" ? true : false)),
                        patientUr: NutritionCache.get("UR") !== undefined ? NutritionCache.get("UR") : '',
                        data: (NutritionCache.get("HOSPSEARCH") !== undefined ? NutritionCache.get("HOSPSEARCH") : []),
                        selected: [],
                        lookups: ['YES', 'NO'],
                        lookup: 'YES',
                        patientName: '',
                        patient: {},
                        setLookup: (function (choice) {
                            this.lookup = choice;
                            this.findAdmissions();
                        }),
                        findAdmissions: (function () {
                            this.loading = true;
                            if (isNaN(this.patientUr)) {
                                if (this.patientName === '')
                                {
                                    this.patientName = this.patientUr;
                                }
                                else {
                                    this.patientName = this.patientUr;
                                    if (this.patientName.length > 3)
                                        this.findAdmissionsByName();
                                }
                            } else
                            {
                                this.patientName = '';
                                this.findAdmissionsByUR();
                            }
                        }),
                        findAdmissionsForPatient: (function(pmiid){
                            NutritionCache.remove("ADM");
                            NutritionCache.remove("HOSPADM");
                            NutritionCache.put("UR", this.patientUr);
                            var inner = this.patientUr;
                            
                                if (pmiid !== '')
                                {
                                    HospPatientSearchFactory.findAdms({id: pmiid, cacheSlayer: new moment()}, function (admFactory) {
                                        $scope.search.hosp.data = [];
                                        if(admFactory.length === 0){
                                            $scope.search.hosp.newHospAdm = true;
                                            $scope.search.hosp.loading = false;
                                            $scope.search.hosp.show = true;
                                        }
                                        angular.forEach(admFactory, function (adm) {
                                           adm.admDate = moment(adm.admDate).toDate();
                                            adm.dischargeDate = moment(adm.dischargeDate).isValid() ? moment(adm.dischargeDate).toDate() : null;
                                            adm.birthDate = moment(adm.birthDate).toDate();
                                            adm.pmiid = adm.pmiid.substring(3, adm.pmiid.length);
                                            $scope.search.hosp.data.push(adm);
                                            $scope.search.hosp.loading = false;
                                            $scope.search.hosp.show = true;
                                            $scope.search.hosp.showgrid = true;
                                        });
                                    });
                                }
                                else{
                                this.patientUr = '';
                                NutritionCache.remove("UR");
                                this.data = [];
                                this.showgrid = false;
                            }
                        }),
                        findAdmissionsByUR: (function () {
                            NutritionCache.remove("ADM");

                            NutritionCache.put("UR", this.patientUr);
                            var inner = this.patientUr;
                            if (this.lookup === 'NO')
                            {
                                if (this.patientUr !== '')
                                {
                                    HospPatientSearchFactory.find({id: this.patientUr, cacheSlayer: new moment()}, function (admFactory) {
                                        $scope.search.hosp.data = [];
                                        angular.forEach(admFactory, function (adm) {
                                           adm.admDate = moment(adm.admDate).toDate();
                                            adm.dischargeDate = moment(adm.dischargeDate).isValid() ? moment(adm.dischargeDate).toDate() : null;
                                            adm.birthDate = moment(adm.birthDate).toDate();
                                            adm.pmiid = adm.pmiid.substring(3, adm.pmiid.length);
                                            $scope.search.hosp.data.push(adm);
                                            $scope.search.hosp.loading = false;
                                            $scope.search.hosp.show = true;
                                            $scope.search.hosp.showgrid = true;
                                        });
                                    });
                                }
                                else{
                                this.patientUr = '';
                                NutritionCache.remove("UR");
                                this.data = [];
                                this.showgrid = false;
                            }
                            }
                            else
                            {
                                if (this.patientUr !== '')
                                {
                                    HospPatientSearchFactory.findCurrent({id: this.patientUr, cacheSlayer: new moment()}, function (admFactory) {
                                        $scope.search.hosp.data = [];
                                        angular.forEach(admFactory, function (adm) {
                                           adm.admDate = moment(adm.admDate).toDate();
                                            adm.dischargeDate = moment(adm.dischargeDate).isValid() ? moment(adm.dischargeDate).toDate() : null;
                                            adm.birthDate = moment(adm.birthDate).toDate();
                                            adm.pmiid = adm.pmiid.substring(3, adm.pmiid.length);
                                            $scope.search.hosp.data.push(adm);
                                            $scope.search.hosp.loading = false;
                                            $scope.search.hosp.show = true;
                                            $scope.search.hosp.showgrid = true;
                                        });
                                    });
                                }
                                else{
                                this.patientUr = '';
                                NutritionCache.remove("UR");
                                this.data = [];
                                this.showgrid = false;
                            }
                            }
                        }),
                        findAdmissionsByName: (function () {
                            NutritionCache.remove("ADM");
                            if (this.lookup === 'NO')
                            {
                                if (this.patientName !== '')
                                {
                                    var names = this.patientName.toLowerCase().split(' ');
                                    var first = '';
                                    var last = '';
                                    if (names.length > 1)
                                    {
                                        first = names[0];
                                        last = names[1];
                                    }
                                    else
                                    {
                                        first = "0";
                                        last = names[1];
                                    }
                                    HospPatientSearchFactory.findname({first: first, last: last, cacheSlayer: new moment()}, function (admFactory) {
                                        $scope.search.hosp.data = [];
                                        angular.forEach(admFactory, function (adm) {
                                            adm.admDate = moment(adm.admDate).toDate();
                                            adm.dischargeDate = moment(adm.dischargeDate).isValid() ? moment(adm.dischargeDate).toDate() : null;
                                            adm.birthDate = moment(adm.birthDate).toDate();
                                            adm.pmiid = adm.pmiid.substring(3, adm.pmiid.length);
                                            $scope.search.hosp.data.push(adm);
                                            $scope.search.hosp.loading = false;
                                            $scope.search.hosp.show = true;
                                            $scope.search.hosp.showgrid = true;
                                        });
                                    });
                                }
                                else{
                                this.patientUr = '';
                                NutritionCache.remove("UR");
                                this.data = [];
                                this.showgrid = false;
                            }
                            }
                            else
                            {
                                if (this.patientName !== '')
                                {
                                    var names = this.patientName.toLowerCase().split(' ');
                                    var first = '';
                                    var last = '';
                                    if (names.length > 1)
                                    {
                                        first = names[0];
                                        last = names[1];
                                    }
                                    else
                                    {
                                        first = "0";
                                        last = names[0];
                                    }
                                    HospPatientSearchFactory.findnamecurr({first: first, last: last, cacheSlayer: new moment()}, function (admFactory) {
                                        $scope.search.hosp.data = [];
                                        angular.forEach(admFactory, function (adm) {
                                            adm.admDate = moment(adm.admDate).toDate();
                                            adm.dischargeDate = moment(adm.dischargeDate).isValid() ? moment(adm.dischargeDate).toDate() : null;
                                            adm.birthDate = moment(adm.birthDate).toDate();
                                            adm.pmiid = adm.pmiid.substring(3, adm.pmiid.length);
                                            $scope.search.hosp.data.push(adm);
                                            $scope.search.hosp.loading = false;
                                            $scope.search.hosp.show = true;
                                            $scope.search.hosp.showgrid = true;
                                        });
                                    });
                                }
                                else{
                                this.patientUr = '';
                                NutritionCache.remove("UR");
                                this.data = [];
                                this.showgrid = false;
                            }
                            }
                        }),
                        goToNutrition: (function (adm) {
                            NutritionCache.put("HOSPADM", adm);
                            NutritionCache.put("HOSPSEARCH", this.data);
                            NutritionCache.put("UR", adm.pmiid);
                            $scope.search.nutrition.pmiid = adm.pmiid;
                            $scope.search.nutrition.admid = adm.admid;
                            $scope.search.nutrition.icuadmid = adm.icuadmid;
                            $scope.search.nutrition.age = moment().diff(moment(adm.birthDate),'years');
                            $scope.search.nutrition.gender = adm.sexDesc.substring(0,1);
                            $scope.search.nutrition.patient = adm;
                            $scope.search.nutrition.goToAssessment();
                        }),
                        gridOptions: ({data: 'search.hosp.data',
                            enableCellSelection: true,
                            enableRowSelecton: true,
                            enableCellEditOnFocus: false,
                            multiSelect: false,
                            sortInfo : {fields: ['admDate'], directions:['desc' || 'asc']},
                            afterSelectionChange: function (row, evt) {
                                //NutritionCache.put("ADM",row.entity);
                                $scope.search.hosp.goToNutrition(row.entity);
                            },
                            columnDefs: [
                                {field: 'admDate', displayName: 'Admitted On', cellFilter:'date: \'dd/MM/yyyy\'',enableCellEdit: false, width: 170},
                                {field: 'wardTferDate', displayName: 'Admitted On', cellFilter:'date:\'dd/MM/yyyy\'', enableCellEdit: false, visible:false},
                                {field: 'admid', displayName: 'ADM ID', enableCellEdit: false, visible: false},
                                {field: 'pmiid', displayName: 'UR', enableCellEdit: false, width: 100},
                                {field: 'accountNumber', displayName: 'ACCT#', enableCellEdit: false, visible: false},
                                {field: 'patientFamilyName', displayName: 'Last Name', enableCellEdit: false, width: 220},
                                {field: 'patientGivenName', displayName: 'First Name', enableCellEdit: false, width: 220},
                                {field: 'birthDate', displayName: 'Birth Date', cellFilter:'date:\'dd/MM/yyyy\'', enableCellEdit: false, width: 100},
                                {field: 'age', displayName: 'Age', enableCellEdit: false, visible: false},
                                {field: 'sexId', displayName: 'SexID', enableCellEdit: false, visible: false},
                                {field: 'sexDesc', displayName: 'Gender', enableCellEdit: false, width: 70},
                                {field: 'languageId', displayName: 'LanguageID', enableCellEdit: false, visible: false},
                                {field: 'languageDesc', displayName: 'Language', enableCellEdit: false, visible: false},
                                {field: 'religionId', displayName: 'ReligionID', enableCellEdit: false, visible: false},
                                {field: 'religionDesc', displayName: 'Religion', enableCellEdit: false, visible: false},
                                {field: 'patientSuburb', displayName: 'Suburb', enableCellEdit: false, visible: false},
                                {field: 'patientPostcode', displayName: 'PostCode', enableCellEdit: false, visible: false},
                                {field: 'dischargeDate', displayName: 'Discharged On',cellFilter:'date:\'dd/MM/yyyy\'', enableCellEdit: false, width: 100},
                                {field: 'id', displayName: 'ID', enableCellEdit: false, visible: false}
                            ]
                        })
                    },
                    patient: {
                        loading: false,
                        show: (NutritionCache.get("SEARCHSET") === undefined ? false : (NutritionCache.get("SEARCHSET") === "PATIENT" ? true : false)),
                        patientUr: NutritionCache.get("UR") !== undefined ? NutritionCache.get("UR") : '',
                        patientUrOnly: NutritionCache.get("UR") !== undefined ? NutritionCache.get("UR") : '',
                        data: (NutritionCache.get("PATIENTSEARCH") !== undefined ? NutritionCache.get("PATIENTSEARCH") : []),
                        selected: [],
                        lookups: ['YES', 'NO'],
                        lookup: 'YES',
                        patientName: '',
                        setLookup: (function (choice) {
                            this.lookup = choice;
                            this.findPatients();
                        }),
                        findPatientsByUROnly: (function () {
                            this.loading = true;
                            this.showgrid = false;
                            this.addNew = false;
                            NutritionCache.remove("PATIENTDEMO");
                            
                            NutritionCache.put("UR", this.patientUrOnly);
                            var inner = this.patientUrOnly;
                            if (this.lookup === 'NO')
                            {

                                if (this.patientUrOnly !== '')
                                {
                                    DemoSearchFactory.find({id: this.patientUrOnly, cacheSlayer: new moment()}, function (demoFactory) {
                                        $scope.search.patient.data = [];
                                        angular.forEach(demoFactory, function (demo) {
                                            demo.birthDate = moment(demo.birthDate).format("DD/MM/YYYY");
                                            $scope.search.patient.data.push(demo);
                                        });
                                        if($scope.search.patient.data.length === 0 )
                                        {
                                            $scope.search.patient.addNew = true;
                                        }
                                        
                                            $scope.search.patient.loading = false;
                                            $scope.search.patient.showgrid = true;
                                            $scope.search.patient.show = true;
                                    });
                                }
                                else{
                                this.patientUr = '';
                                NutritionCache.remove("UR");
                                this.data = [];
                                this.loading = false;
                                this.showgrid = false;
                            }
                            }
                            else
                            {
                                if (this.patientUrOnly !== '')
                                {
                                    DemoSearchFactory.findCurrent({id: this.patientUrOnly, cacheSlayer: new moment()}, function (demoFactory) {
                                        $scope.search.patient.data = [];
                                        angular.forEach(demoFactory, function (demo) {
                                            demo.birthDate = moment(demo.birthDate).format("DD/MM/YYYY");
                                            $scope.search.patient.data.push(demo);
                                        });
                                        if($scope.search.patient.data.length === 0 )
                                        {
                                            $scope.search.patient.addNew = true;
                                        }
                                            $scope.search.patient.showgrid = true;
                                            $scope.search.patient.show = true;
                                            $scope.search.patient.loading = false;
                                    });
                                }
                                else{
                                this.patientUrOnly = '';
                                NutritionCache.remove("UR");
                                this.data = [];
                                this.showgrid = false;
                                this.loading = false;
                            }
                            }
                        }),
                        findPatients: (function () {
                            $scope.search.hosp.showgrid = false;
                            $scope.search.hosp.show = false;
                            $scope.search.patient.showgrid = false;
                            if (isNaN(this.patientUr)) {
                                if (this.patientName === '')
                                {
                                    this.patientName = this.patientUr;
                                }
                                else {
                                    this.patientName = this.patientUr;
                                    if (this.patientName.length > 3)
                                        this.findPatientsByName()
                                }
                            } else
                            {
                                this.patientName = '';
                                this.findPatientsByUR();
                            }
                            
                        }),
                        findPatientsByUR: (function () {
                            this.loading = true;
                            this.showgrid = false;
                            NutritionCache.remove("PATIENTDEMO");
                            
                            NutritionCache.put("UR", this.patientUr);
                            var inner = this.patientUr;
                            if (this.lookup === 'NO')
                            {

                                if (this.patientUr !== '')
                                {
                                    DemoSearchFactory.find({id: this.patientUr, cacheSlayer: new moment()}, function (demoFactory) {
                                        $scope.search.patient.data = [];
                                        angular.forEach(demoFactory, function (demo) {
                                            demo.birthDate = moment(demo.birthDate).format("DD/MM/YYYY");
                                            $scope.search.patient.data.push(demo);
                                        });
                                        $scope.search.patient.loading = false;
                                        $scope.seach.patient.showgrid = true;
                                        $scope.seach.patient.show = true;
                                    });
                                }
                                else{
                                this.patientUr = '';
                                NutritionCache.remove("UR");
                                this.data = [];
                                this.showgrid = false;
                                this.loading = false;
                            }
                            }
                            else
                            {
                                if (this.patientUr !== '')
                                {
                                    DemoSearchFactory.findCurrent({id: this.patientUr, cacheSlayer: new moment()}, function (demoFactory) {
                                        $scope.search.patient.data = [];
                                        angular.forEach(demoFactory, function (demo) {
                                            demo.birthDate = moment(demo.birthDate).format("DD/MM/YYYY");
                                            $scope.search.patient.data.push(demo);
                                        });
                                        $scope.search.patient.loading = false;
                                        $scope.search.patient.showgrid = true;
                                        $scope.seach.patient.show = true;
                                    });
                                }
                                else{
                                this.patientUr = '';
                                NutritionCache.remove("UR");
                                this.data = [];
                                this.showgrid = false;
                                this.loading = false;
                            }
                            }
                        }),
                        findPatientsByName: (function () {
                            NutritionCache.remove("PATIENTDEMO");
                            this.showgrid = false;
                            this.loading = true;
                            if (this.lookup === 'NO')
                            {
                                if (this.patientName !== '')
                                {
                                    var names = this.patientName.toLowerCase().split(' ');
                                    var first = '';
                                    var last = '';
                                    if (names.length > 1)
                                    {
                                        first = names[0];
                                        last = names[1];
                                    }
                                    else
                                    {
                                        first = "0";
                                        last = names[1];
                                    }
                                    DemoSearchFactory.findname({first: first, last: last, cacheSlayer: new moment()}, function (demoFactory) {
                                        $scope.search.patient.data = [];
                                        angular.forEach(demoFactory, function (demp) {
                                            demo.birthDate = moment(demo.birthDate).format("DD/MM/YYYY");
                                            $scope.search.patient.data.push(adm);
                                        });
                                        $scope.search.patient.loading = false;
                                        $scope.search.patient.showgrid = true;
                                        $scope.seach.patient.show = true;
                                    });
                                }
                                else{
                                this.patientUr = '';
                                NutritionCache.remove("UR");
                                this.data = [];
                                this.showgrid = false;
                                this.loading = false;
                            }
                            }
                            else
                            {
                                if (this.patientName !== '')
                                {
                                    var names = this.patientName.toLowerCase().split(' ');
                                    var first = '';
                                    var last = '';
                                    if (names.length > 1)
                                    {
                                        first = names[0];
                                        last = names[1];
                                    }
                                    else
                                    {
                                        first = "0";
                                        last = names[0];
                                    }
                                    DemoSearchFactory.findnamecurr({first: first, last: last, cacheSlayer: new moment()}, function (demoFactory) {
                                        $scope.search.patient.data = [];
                                        angular.forEach(demoFactory, function (demo) {
                                            demo.birthDate = moment(demo.birthDate).format("DD/MM/YYYY");
                                            $scope.search.patient.data.push(demo);
                                        });
                                        $scope.search.patient.loading = false;
                                        $scope.search.patient.showgrid = true;
                                        $scope.search.patient.show = true;
                                    });
                                }
                                else{
                                this.patientUr = '';
                                NutritionCache.remove("UR");
                                this.data = [];
                                this.showgrid = false;
                                this.loading = false;
                            }
                            }
                        }),
                        goToAdmissions: (function (demo) {
                            NutritionCache.put("PATIENTDEMO", demo);
                            NutritionCache.put("PATIENTSEARCH", this.data);
                            NutritionCache.put("UR", demo.patientId);
                            $scope.search.hosp.patientUr = demo.patientId;
                            $scope.search.hosp.patientName = this.patientName;
                            $scope.search.hosp.findAdmissionsForPatient(demo.pmiid);
                            $scope.search.hosp.show = false;
                            $scope.search.hosp.showgrid = false;
                            $scope.search.hosp.loading = true;
                            $scope.search.patient.show = false;
                            $scope.search.patient.showgrid = false;
                        }),
                        clear: (function () {
                            if (NutritionCache.get("PATIENTDEMO") !== undefined)
                            {
                                NutritionCache.remove("PATIENTDEMO");
                            }

                            $scope.search.patient.patientUr = '';
                            $scope.search.patient.data = [];

                        }),
                        gridOptions: ({data: 'search.patient.data',
                            enableCellSelection: true,
                            enableRowSelecton: true,
                            enableCellEditOnFocus: false,
                            multiSelect: false,
                            afterSelectionChange: function (row, evt) {
                                //NutritionCache.put("ADM",row.entity);
                                $scope.search.patient.goToAdmissions(row.entity);
                            },
                            columnDefs: [
                                {field: 'patientId', displayName: 'UR', enableCellEdit: false, width: 100},
                                {field: 'accountNumber', displayName: 'ACCT#', enableCellEdit: false, visible: false},
                                {field: 'patientFamilyName', displayName: 'Last Name', enableCellEdit: false, width: 220},
                                {field: 'patientGivenName', displayName: 'First Name', enableCellEdit: false, width: 220},
                                {field: 'birthDate', displayName: 'Birth Date', enableCellEdit: false, width: 100},
                                {field: 'age', displayName: 'Age', enableCellEdit: false, visible: false},
                                {field: 'sexId', displayName: 'SexID', enableCellEdit: false, visible: false},
                                {field: 'sexDesc', displayName: 'Gender', enableCellEdit: false, width: 70},
                                {field: 'languageId', displayName: 'LanguageID', enableCellEdit: false, visible: false},
                                {field: 'languageDesc', displayName: 'Language', enableCellEdit: false, visible: false},
                                {field: 'religionId', displayName: 'ReligionID', enableCellEdit: false, visible: false},
                                {field: 'religionDesc', displayName: 'Religion', enableCellEdit: false, visible: false},
                                {field: 'patientSuburb', displayName: 'Suburb', enableCellEdit: false, visible: false},
                                {field: 'patientPostcode', displayName: 'PostCode', enableCellEdit: false, visible: false},
                                {field: 'id', displayName: 'ID', enableCellEdit: false, visible: false }
                            ]
                        })
                    }
                };
                $rootScope.print.alerts = [];
                $scope.search.setSearchView('PATIENT');
                if(!angular.isDefined(NutritionCache.get("USERDATA")))
                    SetUpFactory();
            }]);