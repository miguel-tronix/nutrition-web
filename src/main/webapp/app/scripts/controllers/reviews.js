'use strict';

angular.module('nutritionApp.reviews', [])
        .controller('ReviewsCtrl',
                ['$scope','$rootScope', '$location', '$timeout', 'NutritionCache',
                    function ($scope, $rootScope, $location, $timeout, NutritionCache) {
                        //                    function ($scope, $location, NutritionCache) {

                        $scope.reviews = {
                            Review: new Object(),
                            reviews: [],
                            reviews_dictionary: new Hash(),
                            current_plan_reviews_dictionary: new Hash(),
                            ANP: angular.isDefined(NutritionCache.get("ANP")) ? NutritionCache.get("ANP") : null,
                            admId: angular.isDefined(NutritionCache.get("ADMID")) ? NutritionCache.get("ADMID") : null,
                            icuAdmId: angular.isDefined(NutritionCache.get("ICUADMID")) ? NutritionCache.get("ICUADMID") : null,
                            origIcuAdmId: angular.isDefined(NutritionCache.get("ORIGICUADMID")) ? NutritionCache.get("ORIGICUADMID") : null,
                            pmiId: angular.isDefined(NutritionCache.get("PMIID")) ? NutritionCache.get("PMIID") : null,
                            sex: angular.isDefined(NutritionCache.get("SEX")) ? NutritionCache.get("SEX") : null,
                            age: angular.isDefined(NutritionCache.get("AGE")) ? NutritionCache.get("AGE") : null,
                            userId: angular.isDefined(NutritionCache.get("USERNAME")) ? NutritionCache.get("USERNAME") : '',
                            reviewDietician: '',
                            reviewComment: '',
                            locale: '',
                            reviewDate: null,
                            assesmentDate: null,
                            reviewDay: '',
                            eNrecieved: 0.0,
                            pNreceived: 0.0,
                            propofol: 0.0,
                            oralEnergyReceived: 0.0,
                            oralProteinReceived: 0,
                            bowelActions: 0,
                            baItems: [],
                            flexiseal: false,
                            flexisealVolume: 0,
                            numberOfDaysSinceBowelOpened: 0,
                            vomit: false,
                            vomitVolume: 0,
                            totalGastricAspirateVolume: 0,
                            numberOfGastriAspirate: 0,
                            ngItems: [],
                            fineBore: false,
                            pkErythromycin: false,
                            pkMetoclopramide: false,
                            pkOther: false,
                            pkNone: false,
                            pkNotGiven: false,
                            apFleet: false,
                            apEnema: false,
                            apColoxyl: false,
                            apLactulose: false,
                            apMovicol: false,
                            apGoLytely: false,
                            apCerner: false,
                            apNotGiven: false,
                            eNEnergyDailyBal: 0.0,
                            eNProteinDailyBal: 0.0,
                            pNEnergyDailyBal: 0.0,
                            pNProteinDailyBal: 0.0,
                            oralEnergyDailyBal: 0.0,
                            oralProteinDailyBal: 0.0,
                            propofolEnergyDailyBal: 0.0,
                            totalEnergyDailyBal: 0.0,
                            totalProteinDailyBal: 0.0,
                            onLoad: function () {
                                $rootScope.print.alerts = [];
                                this.getReviewsForCurrentPlan();
                            },
                            setUpDefaultVals: function () {
                                // review drop downs:
                                this.eNrecieved = 0;
                                this.pNreceived = 0;
                                this.oralEnergyReceived = 0;
                                this.oralProteinReceived = 0;
                                this.bowelActions = 0;
                                this.numberOfDaysSinceBowelOpened = 0;
                                this.reviewDate = null;
                                this.eNrecieved = 0;
                                this.pNreceived = 0;
                                this.oralEnergyReceived = 0;
                                this.oralProteinReceived = 0;
                                this.bowelActions = 0;
                                this.numberOfDaysSinceBowelOpened = 0;
                                this.reviewDay = moment().format("ddd DD MMM, YYYY");
                                this.totalGastricAspirateVolume = 0;
                                this.numberOfGastriAspirate = 0;
                                this.reviewComment = '';
                                this.reviewDietician = this.userId;
                                this.getNewReview();
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
                            setReviewDefaultVals: function () {
                                this.baItems = [];
                                this.ngItems = [];
                                this.setUpDropdownListValuesGeneralised(0, 20, 1, this.baItems, 0, this.bowelActions);
                                //setUpDropdownListValuesGeneralised(0,10000,1, $("#flexisealVolume"), 0, 0);
                                //setUpDropdownListValuesGeneralised(5,3000,5, $("#eNrecieved"), 0, 0);
                                //setUpDropdownListValuesGeneralised(5,3000,5, $("#pNreceived"), 0, 0);
                                //setUpDropdownListValuesGeneralised(5,1000,5, $("#propofol"), 0, 0);
                                /*setUpDropdownListValuesGeneralised(0,16,0.1, $("#oralEnergyReceived"), 1, 0);
                                 setUpDropdownListValuesGeneralised(0,400,1, $("#oralProteinReceived"), 0, 0);
                                 setUpDropdownListValuesGeneralised(0,20,1, $("#numberOfDaysSinceBowelsOpened"), 0, 0);
                                 setUpDropdownListValuesGeneralised(1,3,1, $("#reviewDay"), 0, 0);
                                 setUpDropdownListValuesGeneralised(0,10000,1, $("#totalGastricApirateVolume"), 0, 0);
                                 setUpDropdownListValuesGeneralised(0,10000,1, $("#flexisealVolume"), 0, 0);
                                 setUpDropdownListValuesGeneralised(0,10000,1, $("#vomitVolume"), 0, 0);*/
                                this.setUpDropdownListValuesGeneralised(0, 6, 1, this.ngItems, 0, this.numberOfGastriAspirate);
                                // review drop downs:

                                this.uncheckAp();
                                this.uncheckPk();
                                $timeout(function () {
                                    $scope.reviews.calcReview();
                                }, 300);

                            },
                            getNutritionValuesForDay: function () {
                                var pMap = new Hash({
                                    'ur': this.pmiId,
                                    'day': moment(this.reviewDate).format("YYYY-MM-DD")
                                });
                                getPersistenceObject(false, "getNutritionValuesForPatientForDay", "../../FBCRecordsService/FBCRecords", pMap, this.endNutritionValuesForDay);
                            },
                            endNutritionValuesForDay: function (xmlHttpRequest, status) {
                                var xmlDoc = $(xmlHttpRequest.responseXML);
                                var soapBody = xmlDoc.find("return");
                                var xmlDOM = $.parseXML(soapBody.text());
                                var $xml = $(xmlDOM);
                                var enrec = parseInt($xml.find("en").text());
                                $("#eNrecieved").val(enrec);
                                var pnrec = parseInt($xml.find("pn").text());
                                $("#pNreceived").val(pnrec);
                                var prop = parseInt($xml.find("propofol").text());
                                var prop_round = Math.floor(prop / 10);
                                $("#propofol").val(prop_round * 10);
                                var vomit = parseInt($xml.find("vomit").text());
                                if (vomit > 0)
                                {
                                    $("#vomit").attr('checked', true);
                                    $("#vomitVolume").val(vomit);
                                }
                                else
                                {
                                    $("#vomit").attr('checked', false);
                                    $("#vomitVolume").val(0);
                                }
                                var bwlMotion = parseInt($xml.find("bowelMotion").text());
                                var flexiVol = parseInt($xml.find("flexiVolume").text());
                                $("#bowelActions").val(bwlMotion);
                                if (flexiVol > 0)
                                {
                                    $("#flexiseal").attr('checked', true);
                                    $("#flexisealVolume").val(vomit);
                                }
                                else
                                {
                                    $("#vomit").attr('checked', false);
                                    $("#vomitVolume").val(0);
                                }
                                var asp = parseInt($xml.find("aspirates").text());
                                $("#totalGastricApirateVolume").val(asp);
                                $timeout(function () {
                                    $scope.reviews.calcReview();
                                }, 300);
                            },
                            setNewReview: function () {
                                this.setReview();
                                this.getReviewsForPlan(NutritionCache.get("ANP"));
                            },
                            getReviewsForPlan: function (ANP) {
                                this.reviews = [];
                                var xml = buildXMLURIEncodedString(ANP, NutritionCache.get("ANPSCREEN"));
                                var pMap = new Hash({
                                    'xml': xml
                                });
                                getPersistenceObject(false, "getReviewsForAssesmentAndPlanObject", "../../NutritionNotesDataAccessService/NutritionNotesDataAccessBean", pMap, this.endReviewsForPlanCall);
                            },
                            endReviewsForPlanCall: function (xmlHttpRequest, status) {
                                  var xmlDoc = $(xmlHttpRequest.responseXML);
                                var soapBody = xmlDoc.find("return");
                                var reviews = $($.parseXML(soapBody.text())).find("Review");
                                if (reviews.length > 0)
                                {
                                    $scope.reviews.reviews_dictionary[NutritionCache.get("assessmentDate")] = reviews;
                                    $scope.reviews.getReviewsForCurrentPlan();
                                }
                                else
                                    $scope.reviews.getNewReview();
                                
                            },
                            getReviewsForCurrentPlan: function () {
                                //console.log(NutritionCache.get("assessmentDate"));
                                var reviews = this.reviews_dictionary[NutritionCache.get("assessmentDate")];
                                if (reviews === null || typeof (reviews) === "undefined")
                                {
                                    this.getReviewsForPlan(NutritionCache.get("ANP"));
                                }
                                else
                                {
                                    this.current_plan_reviews_dictionary = new Hash();
                                    for (i = 0; i < reviews.length; i++)
                                    {
                                        var dt_txt = $(reviews[i]).find("reviewDate").text();
                                        //dt_txt = dt_txt.split(" ")[0] + " " + dt_txt.split(" ")[1] + " EST";
                                        //var id = parseDate(dt_txt).toDateString();//"ddd dd MMM, yyyy");
                                        var id = moment(dt_txt, "YYYY-MM-DD HH:mm:ss '"+this.locale+"'").format("ddd DD MMM, YYYY");//"ddd dd MMM, yyyy");
                                        this.current_plan_reviews_dictionary[id] = reviews[i];
                                    }
                                    this.displayReviewsForPlan();
                                }
                            },
                            displayReviewsForPlan: function () {
                                $scope.reviews.reviews = [];
                                //this.reviews = this.current_plan_reviews_dictionary.keys();
                                angular.forEach(this.current_plan_reviews_dictionary.keys(), function (key) {
                                    $scope.reviews.reviews.push(key);
                                });
                                this.setReviewDefaultVals();
                            },
                            getReview: function (key) {
                                var review = this.current_plan_reviews_dictionary[key];
                                var keys = this.current_plan_reviews_dictionary.keys();
                                setParamsForObject($(review), this);
                                var plid = "review_" + key;
                                //$("#"+plid).attr("class","dictionary_list_active");
                                document.getElementById(plid).setAttribute("class", "dictionary_list_active");
                                for (key in keys)
                                {

                                    var id = "review_" + keys[key];
                                    if (id !== plid)
                                        //$("#"+id).attr("class","dictionary_list");
                                        document.getElementById(id).setAttribute("class", "dictionary_list");
                                }
                                this.Review = $(review);
                                $("#reviewDay").val(moment().format("ddd MMM DD, YYYY"));
                                $timeout(function () {
                                    $scope.reviews.calcReview();
                                }, 300);
                                $timeout(function () {
                                    $scope.reviews.setReviewDefaultVals();
                                }, 300);
                            },
                            getNewReview: function () {
                                var pMap = new Hash();
                                getPersistenceObject(false, "getNewReviewObject", "../../NutritionNotesDataAccessService/NutritionNotesDataAccessBean", pMap, this.endReviewCall);
                            },
                            endSave: function (xmlHttpRequest, status) {
                                //alert("GOT BACK: "+xmlHttpRequest.responseText);
                                var xmlDoc = $(xmlHttpRequest.responseXML);
                                var soapBody = xmlDoc.find("return");
                                var result = soapBody.text();
                                if (result !== "success")
                                {
                                    $rootScope.print.alerts.pop();
                                $rootScope.print.setAlert('danger', 'Review could not be saved');
                                }
                                else
                                {
                                                                    $rootScope.print.alerts.pop();
                                $rootScope.print.setAlert('success', 'Review saved');
                                }
                                $timeout(function(){
                                    $rootScope.print.alerts.pop();
                                }, 3000);
                            },
                            endReviewCall: function (xmlHttpRequest, status) {
                                //alert("GOT BACK: "+xmlHttpRequest.responseText);
                                var xmlDoc = $(xmlHttpRequest.responseXML);
                                var soapBody = xmlDoc.find("return");
                                $scope.reviews.Review = $($.parseXML(soapBody.text())).find("Review");

                                if ($scope.reviews.Review.find("reviewDietician").text() === "none")
                                {
                                    $scope.reviews.Review.find("reviewDietician").text(this.userId);
                                    $scope.reviews.Review.find("assesmentDate").text(NutritionCache.get("ANP").find("assesmentDate").text());
                                }
                                if ($scope.reviews.Review.find("iCUAdmId").text() === "none")
                                    $scope.reviews.Review.find("iCUAdmId").text(this.icuAdmId);

                                setParamsForObject($scope.reviews.Review, $scope.reviews);
                                $("#reviewDay").val(moment().format("ddd DD MMM, YYYY"));
                                $timeout(function () {
                                    $scope.reviews.calcReview();
                                }, 300);
                                $scope.reviews.getDaysSinceLastBowelMovementHosp();
                            },
                            getDaysSinceLastBowelMovementHosp: function () {

                                var pMap = new Hash({
                                    'AdmID': this.admId
                                });
                                getPersistenceObject(false, "getDaysSinceBowelMovementForICUAdmID", "../../NutritionNotesDataAccessService/NutritionNotesDataAccessBean", pMap, this.endBowelMovementCall);
                            },
                            endBowelMovementCall: function (xmlHttpRequest, status) {
                                //alert("GOT BACK: "+xmlHttpRequest.responseText);
                                var xmlDoc = $(xmlHttpRequest.responseXML);
                                var soapBody = xmlDoc.find("return");
                                var days = soapBody.text();
                                if (days === "-1")
                                    days = "N/A";
                                this.numberOfDaysSinceBowelOpened = days;
                            },
                            setReview: function () {
                                if(this.reviewComment === '')
                                    this.reviewComment = 'none';
                                var xmlstr = "&lt;root&gt;";
                                createObjectOfType(NutritionCache.get("ANP"), NutritionCache.get("ANPSCREEN"));
                                xmlstr += buildXMLURIEncodedString(NutritionCache.get("ANP"), NutritionCache.get("ANPSCREEN"));
                                createObjectOfType(this.Review, this);
                                xmlstr += buildXMLURIEncodedString(this.Review, this);
                                xmlstr += "&lt;/root&gt;";
                                $rootScope.print.setAlert('warning', 'Review being saved');
                                setObjectToWebService(true, xmlstr, "setReviewObject", "../../NutritionNotesDataAccessService/NutritionNotesDataAccessBean", this.endSave);
                                this.getReviewsForPlan(NutritionCache.get("ANP"));
                            },
                            removeReview: function () {
                                //var id = Date.parse(this.Review.find("reviewDate").text()).toString("ddd dd MMM, yyyy");
                                //var id = moment(this.Review.find("reviewDate").text(),"YYYY-MM-DD HH:mm:ss 'AEST'").format("ddd DD MMM, YYYY");//"ddd dd MMM, yyyy");
                                var xmlstr = "&lt;root&gt;";
                                createObjectOfType(NutritionCache.get("ANP"), NutritionCache.get("ANPSCREEN"));
                                xmlstr += buildXMLURIEncodedString(NutritionCache.get("ANP"), NutritionCache.get("ANPSCREEN"));
                                createObjectOfType(this.Review, this);
                                xmlstr += buildXMLURIEncodedString(this.Review, this);
                                xmlstr += "&lt;/root&gt;";
                                $rootScope.print.setAlert('warning', 'Review being deleted');
                                setObjectToWebService(false, xmlstr, "removeReviewObject", "../../NutritionNotesDataAccessService/NutritionNotesDataAccessBean", this.endSave);
                                this.getReviewsForPlan(NutritionCache.get("ANP"));
                            },
                            uncheckAp: function () {
                                this.apFleet = false;
                                this.apCerner = false;
                                this.apColoxyl = false;
                                this.apEnema = false;
                                this.apGoLytely = false;
                                this.apLactulose = false;
                                this.apMovicol = false;
                                this.apNotGiven = false;
                            },
                            uncheckPk: function () {
                                this.pkErythromycin = false;
                                this.pkMetoclopramide = false;
                                this.pkOther = false;
                                this.pkNone = false;
                            },
                            getFormulaEnergy: function (formula_id, formula_type) {
                                var formulaEnergy = 0.0;
                                if (formula_type === "EN")
                                {
                                    switch (formula_id) {
                                        case '1':
                                            formulaEnergy = 4.2;
                                            break;
                                        case '2':
                                            formulaEnergy = 4.2;
                                            break;
                                        case '3':
                                            formulaEnergy = 4.2;
                                            break;
                                        case '4':
                                            formulaEnergy = 4.2;
                                            break;
                                        case '5':
                                            formulaEnergy = 4.25;
                                            break;
                                        case '6':
                                            formulaEnergy = 6.3;
                                            break;
                                        case '7':
                                            formulaEnergy = 5.25;
                                            break;
                                        case '8':
                                            formulaEnergy = 6.3;
                                            break;
                                        case '9':
                                            formulaEnergy = 8.4;
                                            break;
                                        case '10':
                                            formulaEnergy = 6.3;
                                            break;
                                        case '11':
                                            formulaEnergy = 5;
                                            break;
                                    }
                                }
                                else if (formula_type === "PN")
                                {
                                    switch (formula_id) {
                                        case '1':
                                            formulaEnergy = 4.2;
                                            break;
                                        case '2':
                                            formulaEnergy = 4.2;
                                            break;
                                    }
                                }
                                else if (formula_type === "Propofol")
                                {
                                    formulaEnergy = 4.6;
                                }

                                return formulaEnergy;
                            },
                            getFormulaProtein: function (formula_id, formula_type) {
                                var formulaProtein = 0;
                                if (formula_type === "EN")
                                {
                                    switch (formula_id) {
                                        case '1':
                                            formulaProtein = 40;
                                            break;
                                        case '2':
                                            formulaProtein = 40;
                                            break;
                                        case '3':
                                            formulaProtein = 43;
                                            break;
                                        case '4':
                                            formulaProtein = 40;
                                            break;
                                        case '5':
                                            formulaProtein = 40;
                                            break;
                                        case '6':
                                            formulaProtein = 60;
                                            break;
                                        case '7':
                                            formulaProtein = 63;
                                            break;
                                        case '8':
                                            formulaProtein = 60;
                                            break;
                                        case '9':
                                            formulaProtein = 75;
                                            break;
                                        case '10':
                                            formulaProtein = 68;
                                            break;
                                        case '11':
                                            formulaProtein = 75;
                                            break;
                                    }
                                }
                                else if (formula_type === "PN")
                                {
                                    switch (formula_id) {
                                        case '1':
                                            formulaProtein = 50;
                                            break;
                                        case '2':
                                            formulaProtein = 70;
                                            break;
                                    }
                                }

                                return formulaProtein;
                            },
                            calcReview: function () {
                                if ((this.eNrecieved > 0) && NutritionCache.get("eNTargetVolume") <= 0) {
                                    //alert("No EN was prescrpibed - pls change the Assesment and Plan");
                                    this.eNrecieved = 0;
                                }
                                if ((this.pNreceived > 0) && NutritionCache.get("pNTargetVolume") <= 0) {
                                    //alert("No PN was prescrpibed - pls change the Assesment and Plan");
                                    this.pNreceived = 0;
                                }
                                if ((this.oralEnergyReceived > 0) && NutritionCache.get("oralEstimateEnergy") <= 0) {
                                    //alert("No oral energy was prescrpibed - pls change the Assesment and Plan");
                                    this.oralEnergyReceived = 0;
                                }
                                if ((this.oralProteinReceived > 0) && NutritionCache.get("oralEstimateProtein") <= 0) {
                                    //alert("No Oral Protein was prescrpibed - pls change the Assesment and Plan");
                                    this.oralProteinReceived = 0;
                                }
                                // EN
                                var enFormulaEnergy = this.getFormulaEnergy(NutritionCache.get("eNFormula"), "EN");
                                var enEnergyProvided = (this.eNrecieved / 1000 * enFormulaEnergy).toFixed(1);
                                var roundedENPercentEnergy = enEnergyProvided * 100 / parseFloat(NutritionCache.get("eNTargetEnergyMJ"));
                                //console.log(enEnergyProvided);
                                //console.log(NutritionCache.get("eNTargetEnergyMJ"));
                                if (isNaN(roundedENPercentEnergy))
                                    roundedENPercentEnergy = 0;
                                this.eNEnergyDailyBal = roundedENPercentEnergy.toFixed(0);

                                var enFormulaProtein = this.getFormulaProtein(NutritionCache.get("eNFormula"), "EN");
                                var enProteinProvided = (this.eNrecieved / 1000 * enFormulaProtein).toFixed(0);
                                var roundedENPercentProtein = enProteinProvided * 100 / NutritionCache.get("eNTargetProtein");
                                if (isNaN(roundedENPercentProtein))
                                    roundedENPercentProtein = 0;
                                this.eNProteinDailyBal = roundedENPercentProtein.toFixed(0);

                                // PN

                                var pnFormulaEnergy = this.getFormulaEnergy(NutritionCache.get("pNFormula"), "PN");
                                var pnEnergyProvided = (this.pNreceived / 1000 * pnFormulaEnergy).toFixed(1);
                                var roundedPNPercentEnergy = pnEnergyProvided * 100 / NutritionCache.get("pNTargetEnergyMJ");
                                if (isNaN(roundedPNPercentEnergy))
                                    roundedPNPercentEnergy = 0;
                                this.pNEnergyDailyBal = roundedPNPercentEnergy.toFixed(0);

                                var pnFormulaProtein = this.getFormulaProtein(NutritionCache.get("pNFormula"), "PN");
                                var pnProteinProvided = (this.pNreceived / 1000 * pnFormulaProtein).toFixed(0);
                                var roundedPNPercentProtein = pnProteinProvided * 100 / NutritionCache.get("pNTargetProtein");
                                if (isNaN(roundedPNPercentProtein))
                                    roundedPNPercentProtein = 0;
                                this.pNProteinDailyBal = roundedPNPercentProtein.toFixed(0);


                                // Oral Energy
                                var roundedOralEnergyPercent = this.oralEnergyReceived * 100 / NutritionCache.get("oralEstimateEnergy");
                                if (isNaN(roundedOralEnergyPercent))
                                    roundedOralEnergyPercent = 0.0;
                                this.oralEnergyReceived = roundedOralEnergyPercent.toFixed(0);
                                // Oral Protein
                                var roundedOralPercentProtein = this.oralProteinReceived * 100 / NutritionCache.get("oralEstimateProtein");
                                if (isNaN(roundedOralPercentProtein))
                                    roundedOralPercentProtein = 0.0;
                                this.oralProteinDailyBal = roundedOralPercentProtein.toFixed(0);

                                // Propofol
                                var propofolFormulaEnergy = this.getFormulaEnergy(0, "Propofol");
                                var propofolEnergyProvided = (this.propofol / 1000 * propofolFormulaEnergy).toFixed(1);
                                var roundedPropofolPercentEnergy = propofolEnergyProvided * 100 / NutritionCache.get("TargetEnergyMJ");
                                if (isNaN(roundedPropofolPercentEnergy))
                                    roundedPropofolPercentEnergy = 0;
                                this.propofolEnergyDailyBal = roundedPropofolPercentEnergy.toFixed(0);

                                var onEnergyProvided = this.oralEnergyReceived;
                                var targetEnergy = NutritionCache.get("TargetEnergyMJ");
                                var totalPercentEnergyBalance = (parseFloat(enEnergyProvided) + parseFloat(pnEnergyProvided) + parseFloat(onEnergyProvided) + parseFloat(propofolEnergyProvided)) / parseFloat(targetEnergy);
                                var onProteinProvided = this.oralProteinReceived;
                                var targetProtein = NutritionCache.get("TargetProtein");
                                var totalPercentProteinBalance = (parseInt(enProteinProvided) + parseInt(pnProteinProvided) + parseInt(onProteinProvided)) / parseInt(targetProtein);

                                totalPercentEnergyBalance = (totalPercentEnergyBalance * 100).toFixed(0);
                                totalPercentProteinBalance = (totalPercentProteinBalance * 100).toFixed(0);

                                if (isNaN(totalPercentEnergyBalance))
                                    totalPercentEnergyBalance = 0;
                                this.totalEnergyDailyBal = totalPercentEnergyBalance;

                                if (isNaN(totalPercentProteinBalance))
                                    totalPercentProteinBalance = 0;
                                this.totalProteinDailyBal = totalPercentProteinBalance;

                            }
                        };

                        $scope.reviews.onLoad();
                    }
                ]);