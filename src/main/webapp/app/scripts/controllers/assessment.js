'use strict';
angular.module('nutritionApp.assessment', [])
        .controller('AssessmentCtrl',
                ['$scope', '$rootScope', '$location', '$timeout', 'NutritionCache',
                    function ($scope, $rootScope, $location, $timeout, NutritionCache) {
                        //                    function ($scope, $location, NutritionCache) {

                        $scope.assessment = {
                            plans: [],
                            ANP: new Object(),
                            anp_dictionary: new Hash(),
                            admId: angular.isDefined(NutritionCache.get("ADMID")) ? NutritionCache.get("ADMID") : null,
                            iCUAdmId: angular.isDefined(NutritionCache.get("PMIID")) ? NutritionCache.get("PMIID") : null,
                            icuAdmId: angular.isDefined(NutritionCache.get("ICUID")) ? NutritionCache.get("PMIID") : null,
                            origIcuAdmId: angular.isDefined(NutritionCache.get("ORIGICUADMID")) ? NutritionCache.get("ICUADMID") : null,
                            pmiId: angular.isDefined(NutritionCache.get("PMIID")) ? NutritionCache.get("PMIID") : null,
                            sex: angular.isDefined(NutritionCache.get("SEX")) ? NutritionCache.get("SEX") : 'M',
                            age: angular.isDefined(NutritionCache.get("AGE")) ? NutritionCache.get("AGE") : 38,
                            userId: angular.isDefined(NutritionCache.get('USERNAME')) ? NutritionCache.get('USERNAME') : '',
                            assessmentDietician: '',
                            assesmentDate: null,
                            locale: '',
                            patientFirstName: '',
                            patientLastName: '',
                            assessment: true,
                            reviews: false,
                            charts: false,
                            summary: false,
                            adjustedWeight: 0,
                            weightSource: 'Dietician',
                            weight: 25,
                            weightItems: [],
                            weightEstimateOrActual: false,
                            equation: 'Schofield',
                            heightCm: 100,
                            heightItems: [],
                            heightSource: 'Dietician',
                            heightEstimateOrActual: false,
                            extraPlan: false,
                            BMI: 0,
                            stressFactor: 1.0,
                            sfItems: [],
                            activityFactor: 1.1,
                            afItems: [],
                            adjustedCalcString: 'Use BMI',
                            adjustedCalcMethod: 1,
                            adjustedCalcItems: [],
                            proteinRequirement: 0.0,
                            prItems: [],
                            rmr: 0,
                            eNTarget: 0,
                            enTargetItems: [],
                            eNHoursFeed: 24,
                            enHoursItems: [],
                            eNFormula: 1,
                            eNTargetVolume: 0.0,
                            eNTargetEnergyMJ: 0.0,
                            eNTargetEnergyKcal: 0,
                            eNTargetProtein: 0.0,
                            pNTargetRate: 0,
                            pnTargetItems: [],
                            pNHoursFeed: 24,
                            pnHoursItems: [],
                            pNFormula: 1,
                            pNTargetVolume: 0.0,
                            pNTargetEnergyMJ: 0.0,
                            pNTargetEnergyKcal: 0,
                            pNTargetProtein: 0,
                            oralDietCode: '',
                            oralEstimateEnergy: 0.0,
                            oralEstimateEnergyKcal: 0.0,
                            oralEstimateProtein: 0.0,
                            dailyEnergyRequirements: 0.0,
                            dailyEnergyRequirementsKcal: 0.0,
                            dailyProteinRequirements: 0.0,
                            targetEnergyMJ: 0.0,
                            targetEnergyKcal: 0.0,
                            targetProtein: 0.0,
                            url: NutritionCache.get("URL"),
                            progressToDateHistory: '',
                            onLoad: function () {
                                $rootScope.print.alerts = [];
                                var strur = this.pmiId;
                                if (strur.length < 7) {
                                    while (strur.length < 7) {
                                        var zr = "0";
                                        strur = zr.concat(strur);
                                    }
                                }

                                this.ur = strur;
                                this.getANP(); 
                                this.setUpDropdownLists();
                                $("#accordion").accordion();
                                $("#accordion2").accordion();
                            },
                            setUpDropdownLists: function () {
                                //assesment
                                this.heightItems = [];
                                this.weightItems = [];
                                this.sfItems = [];
                                this.afItems = [];
                                this.prItems = [];
                                this.adjustedCalcItems = [];
                                this.enHoursItems = [];
                                this.enTargetItems = [];
                                this.pnTargetItems = [];
                                this.pnHoursItems = [];
                                this.setUpDropdownListValuesGeneralised(100, 250, 1, this.heightItems, 0, this.heightCm);
                                this.setUpDropdownListValuesGeneralised(25, 350, 1, this.weightItems, 0, this.weight);
                                this.setUpDropdownListValuesGeneralised(1, 2, 0.1, this.sfItems, 1, this.stressFactor);
                                this.setUpDropdownListValuesGeneralised(1, 1.1, 0.1, this.afItems, 1, this.activityFactor);
                                this.afItems.push({text: 1.15, value: 1.15});
                                this.afItems.push({text: 1.20, value: 1.20});
                                $("#adjustedCalcMethod").append("<option value='1' selected='true'>use BMI</option>");
                                $("#adjustedCalcMethod").append("<option value='2'>65%</option>");
                                $("#adjustedCalcMethod").append("<option value='3'>75%</option>");
                                var i = 20;
                                for (i = 20; i < 35; i++) {
                                    $("#adjustedCalcMethod").append("<option value='" + i + "'>" + i + "</option>");
                                }
                                //$("#activityFactor").append("<option value='1.15'>1.15</option>");
                                //$("#activityFactor").append("<option value='1.15'>1.20</option>");
                                this.setUpDropdownListValuesGeneralised(1, 2.5, 0.1, this.prItems, 1, this.proteinRequirement);
                                //$("#adjustedCalcMethod").append("<option value='1' selected='true'>use BMI</option>");
                                //$("#adjustedCalcMethod").append("<option value='2'>65%</option>");
                                //$("#adjustedCalcMethod").append("<option value='3'>75%</option>");
                                this.adjustedCalcItems.push({text: "Use BMI", value: 1});
                                this.adjustedCalcItems.push({text: "65%", value: 2});
                                this.adjustedCalcItems.push({text: "75%", value: 3});
                                this.setUpDropdownListValuesGeneralised(20, 35, 1, this.adjustedCalcItems, 0, this.adjustedCalcMethod);
                                this.setUpDropdownListValuesGeneralised(10, 130, 5, this.enTargetItems, 0, this.eNTarget);
                                this.setUpDropdownListValuesGeneralised(0, 24, 1, this.enHoursItems, 0, this.eNHoursFeed);
                                this.setUpDropdownListValuesGeneralised(10, 130, 5, this.pnTargetItems, 0, this.pNTargetRate);
                                this.setUpDropdownListValuesGeneralised(0, 24, 1, this.pnHoursItems, 0, this.pNHoursFeed);
                            },
                            setUpDefaultVals: function (partial) {
//assesment
                                $("#adjustedCalcMethod").html("");

                                this.heightSource = "Dietician";
                                this.weightSource = "Dietician";
                                this.stressFactor = parseFloat("1.0");
                                this.activityFactor = parseFloat("1.0");
                                this.proteinRequirement = parseFloat("1.0");
                                this.adjustedCalcMethod = 1;
                                //plan
                                this.eNTarget = 0;
                                this.eNHoursFeed = 24;
                                this.pNTargetRate = 0;
                                this.pNHoursFeed = 24;
                                this.equation = "Schofield";
                                this.eNFormula = 1;
                                this.pNFormula = 1;
                                this.oralDietCode = 0;
                                this.setUpDropdownLists();
                                this.calcBMI();
                                
                                if (partial) {
                                    this.getANP();
                                }
                            },
                            setNewANP: function () {
                                if ($.trim($("#progressToDateHistory").val()) === '')
                                {
                                    $("#progressToDateHistory").val("none");
                                }
                                this.setANP(false);
                                this.getANP();
                            },
                            setANP: function (async) {
                                createObjectOfType(this.ANP, this);
                                var xmlstr = buildXMLURIEncodedString(this.ANP, this);
                                $rootScope.print.alerts.pop();
                                $rootScope.print.setAlert('warning', 'Assessment being saved');
                                setObjectToWebService(async, xmlstr, "setAssesmentAndPlanObject", "../../NutritionNotesDataAccessService/NutritionNotesDataAccessBean", this.endSave);
                            },
                            getANP: function () {
                                var pMap = new Hash({
                                    'AdmId': this.admId
                                });
                                getPersistenceObject(false, "getAssesmentAndPlanObjects", "../../NutritionNotesDataAccessService/NutritionNotesDataAccessBean", pMap, this.endANPCall);
                            },
                            endANPCall: function (xmlHttpRequest, status) {
                                $scope.assessment.anp_dictionary = new Hash();
                                var xmlDoc = $(xmlHttpRequest.responseXML);
                                var soapBody = xmlDoc.find("return");
                                var ANParr = $($.parseXML(soapBody.text())).find("Assesmentandplan");
                                if (ANParr.length > 0)
                                {

                                    for (i = 0; i < ANParr.length; i++)
                                    {
                                        var inner = ANParr[i];
                                        if ($(inner).find("assessmentDietician").text() !== "none")
                                        {
                                            var dt = $(inner).find("assesmentDate").text();
                                            var key = moment(dt, "YYYY-MM-DD HH:mm:ss '" + this.locale + "'").format("ddd DD MMM, YYYY"); //"ddd dd MMM, yyyy");
                                            var extra = $(inner).find("extraPlan").text();
                                            if (eval(extra))
                                                key += "_2";
                                            $scope.assessment.anp_dictionary[key] = inner;
                                        }
                                    }
                                    $scope.assessment.ANP = $(ANParr[0]);
                                }

                                if ($scope.assessment.ANP.find("admId").text() === "none")
                                    $scope.assessment.ANP.find("admId").text($scope.assessment.admId);
                                if ($scope.assessment.ANP.find("ur").text() === "none")
                                    $scope.assessment.ANP.find("ur").text($scope.assessment.pmiId);
                                if ($scope.assessment.ANP.find("iCUAdmId").text() === "none")
                                    $scope.assessment.ANP.find("iCUAdmId").text($scope.assessment.icuAdmId);
                                if ($scope.assessment.ANP.find("assessmentDietician").text() === "none")
                                    $scope.assessment.ANP.find("assessmentDietician").text($scope.assessment.userId);
                                setParamsForObject($scope.assessment.ANP, $scope.assessment);
                                if (typeof $scope.assessment.weight === "undefined" || $scope.assessment.weight === 0)
                                    $scope.assessment.setUpDefaultVals(false);
                                $scope.assessment.displayPlansInDictionary();
                                $scope.assessment.updateOralSupplementCheckboxes();
                                $scope.assessment.calculatePage();
                            },
                            displayPlansInDictionary: function () {
                                this.plans = [];
                                var keys = $scope.assessment.anp_dictionary.keys();
                                angular.forEach(keys, function (key) {
                                    $scope.assessment.plans.push(key);
                                });
                            },
                            getPlan: function (key) {
                                var plan = this.anp_dictionary[key];
                                var keys = this.anp_dictionary.keys();
                                setParamsForObject($(plan), this);
                                if (this.assesmentDeitician === '')
                                    this.assesmentDeitician = this.userId;
                                var plid = "plan_" + key;
                                document.getElementById(plid).setAttribute("class", "dictionary_list_active");
                                angular.forEach(keys, function (key)
                                {

                                    var id = "plan_" + key;
                                    if (id !== plid)
                                        //$("#"+id).attr("class","dictionary_list");
                                        document.getElementById(id).setAttribute("class", "dictionary_list");
                                });
                                this.ANP = $(plan);
                                this.setCache();
                                this.calculatePage();
                                this.updateOralSupplementCheckboxes();
                            },
                            updateOralSupplementCheckboxes: function () {
                                var oralSupplements = $("#oralSupplements").val();
                                this.clearSupplementCheckboxes();
                                if (oralSupplements !== "")
                                {
                                    var oralSuppArr = oralSupplements.split(",");
                                    for (i = 0; i < oralSuppArr.length; i++)
                                    {
                                        $("#os" + oralSuppArr[i]).attr("checked", true);
                                    }
                                }
                            },
                            updateOralSupplementText: function (chk_id) {
                                $("#oralSupplements").val("");
                                var addToText = "0";
                                for (i = 1; i < 16; i++)
                                {
                                    var bool = document.getElementById("os" + i).checked;
                                    if (bool)
                                    {
                                        addToText += "," + i;
                                    }
                                }

                                $("#oralSupplements").val(addToText);
                            },
                            setUpDropdownListValuesGeneralised: function (start, end, step, element, decimalPlaces, defaultValue) {
                                var isArray = angular.isArray(element);
                                if (!isArray)
                                    $(element).append("<option value='" + 0 + "'>0</option>");
                                while (end + step > start.toFixed(decimalPlaces))
                                {
                                    var appendString = ("<option value='" + start.toFixed(decimalPlaces) + "'");
                                    var appendString2 = "";
                                    if (start.toFixed(decimalPlaces) === defaultValue) {
                                        appendString2 = appendString + " selected='true' ";
                                    } else {
                                        appendString2 = appendString;
                                    }
                                    var appendString3 = (appendString2 + ">" + start.toFixed(decimalPlaces) + "</option>");
                                    if (!isArray)
                                        $(element).append(appendString3);
                                    else
                                        element.push({text: start.toFixed(decimalPlaces), value: start.toFixed(decimalPlaces)});
                                    start += step;
                                }
                            },
                            dodgeSex: function () {
                                //alert("dodgesex called");
                                if (this.equation === "SchofieldMale") {
                                    //alert("setting sex to male");
                                    this.equation = "Schofield";
                                    this.sex = 'M';
                                }
                                if (this.equation === "SchofieldFemale") {
                                    //alert("setting sex to female");
                                    this.equation = "Schofield";
                                    this.sex = 'F';
                                }
                                this.calcEquation();
                            },
                            clearSupplementCheckboxes: function () {
                                $("#os1").attr("checked", false);
                                $("#os2").attr("checked", false);
                                $("#os3").attr("checked", false);
                                $("#os4").attr("checked", false);
                                $("#os5").attr("checked", false);
                                $("#os6").attr("checked", false);
                                $("#os7").attr("checked", false);
                                $("#os8").attr("checked", false);
                                $("#os9").attr("checked", false);
                                $("#os10").attr("checked", false);
                                $("#os11").attr("checked", false);
                                $("#os12").attr("checked", false);
                                $("#os13").attr("checked", false);
                                $("#os14").attr("checked", false);
                                $("#os15").attr("checked", false);
                            },
                            endDemographicCall: function (xmlHttpRequest, status) {
                                var xmlDoc = $(xmlHttpRequest.responseXML);
                                var soapBody = xmlDoc.find("return");
                                var sexTag = $($.parseXML(soapBody.text())).find("Sex");
                                var demo = $($.parseXML(soapBody.text())).find("Demographic");
                                $scope.assessment.sex = $(sexTag).find("description").text();
                                var firstName = $(demo).find("patientFirstName").text();
                                $scope.assessment.patientFirstName = firstName;
                                var lastName = $(demo).find("patientLastName").text();
                                $scope.assessment.patientLastName = lastName;
                                if (!isNaN($scope.assessment.age))
                                {

                                }
                                else
                                    $scope.assessment.calculatePage();
                                //setTimeout("getLast5ReviewComments()", 10);
                            },
                            endAgeCall: function (xmlHttpRequest, status) {
                                var xmlDoc = $(xmlHttpRequest.responseXML);
                                var soapBody = xmlDoc.find("return");
                                var years = soapBody.text();
                                if (years === "-1")
                                    years = "N/A";
                                $scope.assessment.age = years;
                            },
                            endSave: function (xmlHttpRequest, status) {
                                var xmlDoc = $(xmlHttpRequest.responseXML);
                                var soapBody = xmlDoc.find("return");
                                var result = soapBody.text();
                                if (result !== "success")
                                {
                                    $rootScope.print.alerts.pop();
                                    $rootScope.print.setAlert('danger', 'Assessment could not be saved');
                                }
                                else
                                {
                                    $rootScope.print.alerts.pop();
                                    $rootScope.print.setAlert('success', 'Assessment saved');
                                }
                                $timeout(function () {
                                    $rootScope.print.alerts.pop();
                                }, 3000);
                            },
                            calcBMI: function () {
                                var heightSquare = 0.0;
                                var actualBMI = 0;
                                heightSquare = (this.heightCm * this.heightCm / 10000);
                                actualBMI = (this.weight / heightSquare).toFixed(0);
                                this.BMI = actualBMI;
                                if (this.adjustedCalcMethod === '1') {
                                    this.adjustedWeight = this.weight * 1;
                                    // alert("adjustedCalcMethod is 1");
                                } else {
                                    if (this.adjustedCalcMethod === '2') {
                                        this.adjustedWeight = (0.65 * actualBMI * heightSquare).toFixed(0);
                                        //alert("adjustedCalcMethod 65%");
                                    } else {
                                        if (this.adjustedCalcMethod === '3') {
                                            this.adjustedWeight = (0.75 * actualBMI * heightSquare).toFixed(0);
                                            //  alert("adjustedCalcMethod 75%");
                                        } else {
                                            this.adjustedWeight = (this.adjustedCalcMethod * heightSquare).toFixed(0);
                                            //   alert ("deafult BMI calcs " + adjustedCalcMethod + " " + actualBMI + " " + heightSquare);
                                        }

                                    }
                                }
                                // then to fix everything up again, after the changes:
                                this.calcEquation();
                            },
                            setCache: function () {
                                NutritionCache.put("ANP", this.ANP);
                                NutritionCache.put("ANPSCREEN", this);
                                NutritionCache.put("eNTarget", this.eNTarget);
                                NutritionCache.put("eNTargetVolume", this.eNTargetVolume);
                                NutritionCache.put("pNTargetVolume", this.pNTargetVolume);
                                NutritionCache.put("pNTarget", this.pNTargetRate);
                                NutritionCache.put("oralEstimateEnergy", this.oralEstimateEnergy);
                                NutritionCache.put("oralEstimateProtein", this.oralEstimateProtein);
                                NutritionCache.put("eNTargetEnergyMJ", this.eNTargetEnergyMJ);
                                NutritionCache.put("eNTargetProtein", this.targetProtein);
                                NutritionCache.put("eNFormula", this.eNFormula);
                                NutritionCache.put("pNTargetEnergyMJ", this.pNTargetEnergyMJ);
                                NutritionCache.put("pNTargetProtein", this.pNTargetProtein);
                                NutritionCache.put("pNFormula", this.pNFormula);
                                NutritionCache.put("TargetEnergyMJ", this.targetEnergyMJ);
                                NutritionCache.put("TargetProtein", this.targetProtein);
                                NutritionCache.put("oralEstimateProtein", this.oralEstimateProtein);
                                NutritionCache.put("oralEstimateEnergy", this.oralEstimateEnergy);
                                NutritionCache.put("assesmentDate", this.assesmentDate);
                            },
                            calculatePage: function () {
                                this.calcBMI();
                                this.planCalcs();
                                this.setCache();
                                $timeout(function () {
                                    $scope.assessment.setUpDropdownLists();
                                }, 300);
                            },
                            calcEquation: function () {
                                // for testing
                                //alert("calcEquation called");
                                if (this.age <= 10) {
                                    alert("age is less than 10");
                                }
                                if (this.age >= 120) {
                                    alert("age is great than 120");
                                }
                                if ((this.age <= 10) || (this.age >= 120)) {
                                    //alert("age calcs really out of bounds");
                                    this.age = 38;
                                    alert("something's wrong. age is " + this.age + " by default");
                                }

                                var energyRequired = 0.0;
                                var proteinRequired = 0;
                               
                                if(this.equation === "Schofield")
                                        energyRequired = this.calcSchofield();
                                else if(this.equation === "Calorimetry")
                                        //					energyRequired = (document.getElementById("rmr").value*1).toFixed(1);
                                        energyRequired = (this.rmr * 1).toFixed(1);
                                this.dailyEnergyRequirements = energyRequired;
                                this.dailyEnergyRequirementsKcal = ((energyRequired * 1000) / (4.19 * this.weight)).toFixed(0);
                               
                                // protein requirements based on adjustedCalcMethod
                                proteinRequired = (this.proteinRequirement * this.adjustedWeight);
                                this.dailyProteinRequirements = proteinRequired.toFixed(1);
                            },
                            calcSchofield: function () {
                                var energyRequired = 0.0;
                                
                                if ((this.age <= 10) || (this.age >= 120)) {
                                    this.age = 38;
                                    //alert("something is wrong: the age is not set. Age now set to 38 by default.");
                                }


                                if (this.sex === 'M') {
                                    if ((this.age >= 10) && (this.age <= 17))
                                        energyRequired = (2.754 + (0.074 * this.weight));
                                    if ((this.age >= 18) && (this.age <= 29))
                                        energyRequired = (2.896 + (0.063 * this.weight));
                                    if ((this.age >= 30) && (this.age <= 59))
                                        energyRequired = (3.653 + (0.048 * this.weight));
                                    if ((this.age >= 60) && (this.age <= 74))
                                        energyRequired = (2.930 + (0.0499 * this.weight));
                                    if (this.age >= 75)
                                        energyRequired = (3.434 + (0.0350 * this.weight));
                                    else
                                        energyRequired = (0 + (0.0 * this.weight));
                                }
                                else if (this.sex === 'F') {
                                    if ((this.age >= 10) && (this.age <= 17))
                                        energyRequired = (2.898 + (0.056 * this.weight));
                                    if ((this.age >= 18) && (this.age <= 29))
                                        energyRequired = (2.036 + (0.062 * this.weight));
                                    if ((this.age >= 30) && (this.age <= 59))
                                        energyRequired = (3.538 + (0.034 * this.weight));
                                    if ((this.age >= 60) && (this.age <= 74))
                                        energyRequired = (2.875 + (0.0386 * this.weight));
                                    if (this.age >= 75)
                                        energyRequired = (2.61 + (0.041 * this.weight));
                                    else
                                        energyRequired = (0 + (0.0 * this.weight));
                                }
                                this.schofieldMidCalc = energyRequired.toFixed(1);
                                var retval = 0;
                                retval = (energyRequired * this.stressFactor * this.activityFactor).toFixed(1);
                                return retval;
                            },
                            planCalcs: function () {
                                var enEnergyProvided = 0.0;
                                var enProteinProvided = 0;
                                var pnEnergyProvided = 0;
                                var pnProteinProvided = 0;
                                var oralEstimateEnergy = 0;
                                var oralEstimateProtein = 0;
                                var totalEnergyProvided = 0.0;
                                var totalProteinProvided = 0;
                                var formulaEnergy = 0;
                                var formulaProtein = 0;
                                // in future edits, set the default EN target rate so that it matches and automatically sets up the right energy levels
                                // after that, setup the formula selection so that it selects a formula that meets the protein requirements
                                // with PN, if not all amounts are set, and they onFocus that input, default to a value that will meet the requirements immediately
                                // make the total energy and protein red background, until they have met the requirements, when they should become green.


                                // en calcs
                                var enTargetVol = this.eNTarget * this.eNHoursFeed;
                                this.eNTargetVolume = enTargetVol;
                                var formulaForCalcs = this.eNFormula;
                              
                                if (formulaForCalcs === '1') {
                                    formulaEnergy = 4.2;
                                    formulaProtein = 40;
                                }
                                if (formulaForCalcs === '2') {
                                    formulaEnergy = 4.2;
                                    formulaProtein = 40;
                                }
                                if (formulaForCalcs === '3') {
                                    formulaEnergy = 4.2;
                                    formulaProtein = 43;
                                }
                                if (formulaForCalcs === '4') {
                                    formulaEnergy = 4.2;
                                    formulaProtein = 40;
                                }
                                if (formulaForCalcs === '5') {
                                    formulaEnergy = 4.25;
                                    formulaProtein = 40;
                                }
                                if (formulaForCalcs === '6') {
                                    formulaEnergy = 6.3;
                                    formulaProtein = 60;
                                }
                                if (formulaForCalcs === '7') {
                                    formulaEnergy = 5.25;
                                    formulaProtein = 63;
                                }
                                if (formulaForCalcs === '8') {
                                    formulaEnergy = 6.3;
                                    formulaProtein = 60;
                                }
                                if (formulaForCalcs === '9') {
                                    formulaEnergy = 8.4;
                                    formulaProtein = 75;
                                }
                                if (formulaForCalcs === '10') {
                                    formulaEnergy = 6.3;
                                    formulaProtein = 68;
                                }
                                if (formulaForCalcs === '11') {
                                    formulaEnergy = 5;
                                    formulaProtein = 75;
                                }

                                enEnergyProvided = (enTargetVol / 1000 * formulaEnergy).toFixed(1);
                                this.eNTargetEnergyMJ = enEnergyProvided;
                                this.eNTargetEnergyKcal = (parseFloat(enEnergyProvided) * 1000 / 4.19).toFixed(0);
                                
                                enProteinProvided = (enTargetVol / 1000 * formulaProtein).toFixed(0);
                                this.eNTargetProtein = enProteinProvided;
                                
                                //end of en calcs

                                // pn calcs
                                formulaEnergy = 0;
                                formulaProtein = 0;
                                var pnTargetVol = (this.pNTargetRate * this.pNHoursFeed);
                                this.pNTargetVolume = pnTargetVol;
                                var formulaForCalcs2 = this.pNFormula;
                                if(formulaForCalcs2 === '1'){
                                    formulaEnergy = 4.2;
                                        formulaProtein = 50;
                                }
                                if(formulaForCalcs2 === '2'){
                                    formulaEnergy = 4.2;
                                        formulaProtein = 70;
                                }
                                pnEnergyProvided = (pnTargetVol / 1000 * formulaEnergy).toFixed(1);
                                
                                pnProteinProvided = (pnTargetVol / 1000 * formulaProtein).toFixed(0);
                                
                                this.pNTargetEnergyMJ = pnEnergyProvided;
                                this.pNTargetEnergyKcal = (pnEnergyProvided * 1000 / 4.19).toFixed(0);
                                this.pNTargetProtein = pnProteinProvided;
                                //end of pn calcs

                                // oral start
                                //

                                oralEstimateEnergy = this.oralEstimateEnergy;
                                this.oralEstimateEnergyKcal = (oralEstimateEnergy * 1000 / 4.19).toFixed(0);
                                oralEstimateProtein = this.oralEstimateProtein;
                                // oral end

                                // totals for enegey and protein plan
                                totalEnergyProvided = ((enEnergyProvided * 1) + (pnEnergyProvided * 1) + (oralEstimateEnergy * 1));
                                totalProteinProvided = ((enProteinProvided * 1) + (pnProteinProvided * 1) + (oralEstimateProtein * 1)).toFixed(0);
                                
                                this.targetEnergyMJ = totalEnergyProvided;
                                this.targetEnergyKcal = ((totalEnergyProvided * 1000) / (4.19 * this.weight)).toFixed(1);
                                this.targetProtein = totalProteinProvided;
                                // alert the user that it's all good, or not ...
                                var withinBounds = '0';
                                withinBounds = (totalEnergyProvided - this.dailyEnergyRequirements);
                                if (withinBounds < 0) {
                                    document.getElementById("TargetEnergyMJ").style.background = '#FFAAAA';
                                    document.getElementById("TargetEnergyKcal").style.background = '#FFAAAA';
                                }
                                else
                                {
                                    document.getElementById("TargetEnergyMJ").style.background = '#EAEAEA';
                                    document.getElementById("TargetEnergyKcal").style.background = '#EAEAEA';
                                }
                                withinBounds = (totalProteinProvided - this.dailyProteinRequirements);
                                if (withinBounds < 0) {
                                    document.getElementById("TargetProtein").style.background = '#FFAAAA';
                                }
                                else
                                {
                                    document.getElementById("TargetProtein").style.background = '#EAEAEA';
                                }
                            }
                        };
                        $scope.assessment.onLoad();
                    }]);