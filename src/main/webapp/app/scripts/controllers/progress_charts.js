'use strict';

angular.module('nutritionApp.progressCharts', [])
        .controller('ProgressChartsCtrl',
                ['$scope', '$rootScope', '$timeout', '$location', 'NutritionCache',
                    function ($scope, $rootScope, $timeout, $location, NutritionCache) {
                        //                    function ($scope, $location, NutritionCache) {

                        $scope.progressCharts = {
                            admId: angular.isDefined(NutritionCache.get("ADMID")) ? NutritionCache.get("ADMID") : null,
                            icuAdmId: angular.isDefined(NutritionCache.get("ICUADMID")) ? NutritionCache.get("ICUADMID") : null,
                            origIcuAdmId: angular.isDefined(NutritionCache.get("ORIGICUADMID")) ? NutritionCache.get("ORIGICUADMID") : null,
                            pmiId: angular.isDefined(NutritionCache.get("PMIID")) ? NutritionCache.get("PMIID") : null,
                            sex: angular.isDefined(NutritionCache.get("SEX")) ? NutritionCache.get("SEX") : null,
                            age: angular.isDefined(NutritionCache.get("AGE")) ? NutritionCache.get("AGE") : null,
                            userId: angular.isDefined(NutritionCache.get("USER")) ? NutritionCache.get("USER") : '',
                            plot_dictionary: new Hash(),
                            locale: '',
                            showFlags: {
                                showDeficit: true,
                                showEnergy: false,
                                showProtein: false,
                                showCumulP: false,
                                showCumulE: false,
                                showNG: false
                            },
                            energyChartData: [],
                            energyChart: {},
                            proteinChart: {},
                            targetProteinChart: {},
                            targetEnergyChart: {},
                            deficitChart: {},
                            cumulEnergyChart: {},
                            cumulProteinChart: {},
                            gastricChart: {},
                            proteinChartData: [],
                            targetEnergyChartData: [],
                            targetProteinChartData: [],
                            deficitChartData: [],
                            gastricChartData: [],
                            summaryTargetEnergyChartData: [],
                            summaryTargetProteinChartData: [],
                            summaryTargetEnergyChartSmlData: [],
                            summaryTargetProteinChartSmlData: [],
                            summaryGastricChartData: [],
                            onLoad: function () {
                                $rootScope.print.alerts = [];
                                this.getPlottingObjectsForAdmID();
                                this.getLast5ReviewComments();
                            },
                            hideOthers: function (show) {
                                angular.forEach($scope.progressCharts.showFlags, function (value, key) {
                                    if (value)
                                        $scope.progressCharts.showFlags[key] = false;
                                });
                                this.showFlags[show] = true;

                            },
                            plotDailyDeficit: function () {
                                $("#dailyDeficits").text("");

                                this.deficitChart = new AmCharts.makeChart("dailyDeficits", {
                                    "type": "serial",
                                    "valueAxes": [
                                        {
                                            "stackType": "none",
                                            "gridAlpha": 0.1,
                                            "axisAlpha": 0
                                        }
                                    ],
                                     "export": {
                                        "enabled": true,
                                        "libs": {
                                            "path": "bower_components/amcharts/dist/amcharts/plugins/export/libs/"
                                        }
                                    },
                                    "chartCursor": {
                                        "oneBalloonOnly": false
                                    },
                                    "legend": {
                                        "useGraphSettings": true
                                    },
                                    "chartScrollbar": {
                                        "updateOnReleaseOnly": true
                                    }
                                });
                                this.deficitChart.dataProvider = this.deficitChartData;
                                this.deficitChart.categoryField = "date";
                                this.deficitChart.plotAreaBorderAlpha = 0.2;
                                this.deficitChart.path = "bower_components/amcharts/dist/amcharts/";
                                this.deficitChart.startDuration = 1;
                                this.deficitChart.autoResize = false;
                                this.deficitChart.zoomOutButton = {
                                    backgroundColor: '#000000',
                                    backgroundAlpha: 0.15
                                };

                                // AXES
                                // category
                                var categoryAxis = this.deficitChart.categoryAxis;
                                categoryAxis.axisAlpha = 1;
                                categoryAxis.gridAlpha = 0.15;
                                categoryAxis.position = "bottom";
                                categoryAxis.axisColor = "#000000";
                                categoryAxis.dashLength = 1;
                                categoryAxis.parseDates = true;
                                categoryAxis.minPeriod = "DD";


                                // GRAPHS
                                // first graph    

                                var energy = new AmCharts.AmGraph();
                                energy.title = "Energy (%)";
                                energy.balloonText = "[[title]]: [[value]]";
                                energy.valueField = "Energy (%)";
                                energy.type = "column";
                                energy.lineThickness = 2;
                                energy.fillAlphas = 1;
                                energy.bullet = "round";
                                energy.lineColor = "Blue";

                                var energyCumul = new AmCharts.AmGraph();
                                energyCumul.title = "Energy Cumulative (%)";
                                energyCumul.balloonText = "[[title]]: [[value]]";
                                energyCumul.valueField = "Energy Cumulative (%)";
                                energyCumul.type = "line";
                                energyCumul.lineThickness = 2;
                                energyCumul.bullet = "round";
                                energyCumul.lineColor = "Blue";

                                var protein = new AmCharts.AmGraph();
                                protein.title = "Protein (%)";
                                protein.balloonText = "[[title]]: [[value]]";
                                protein.valueField = "Protein (%)";
                                protein.type = "column";
                                protein.lineThickness = 2;
                                protein.fillAlphas = 1;
                                protein.bullet = "round";
                                protein.lineColor = "Orange";

                                var proteinCumul = new AmCharts.AmGraph();
                                proteinCumul.title = "Protein Cumulative(%)";
                                proteinCumul.balloonText = "[[title]]: [[value]]";
                                proteinCumul.valueField = "Protein Cumulative (%)";
                                proteinCumul.type = "line";
                                proteinCumul.lineThickness = 2;
                                proteinCumul.bullet = "round";
                                proteinCumul.lineColor = "Orange";

                                this.deficitChart.addGraph(energy);
                                this.deficitChart.addGraph(protein);
                                this.deficitChart.addGraph(energyCumul);
                                this.deficitChart.addGraph(proteinCumul);

                                this.deficitChart.addListener("dataUpdated", this.zoomDeficitChart);
                                
                                

                            },
                            plotDailyEnergy: function () {
                                $("#dailyEnergy").text("");

                                var groupHash = new Hash();
                                groupHash["PN Energy Delivered (MJ)"] = "Red";
                                groupHash["EN Energy Delivered (MJ)"] = "Green";
                                groupHash["ON Energy Delivered (MJ)"] = "Pink";
                                groupHash["Propofol Energy Delivered (MJ)"] = "Purple";


                                this.energyChart = AmCharts.makeChart("dailyEnergy", {
                                    "type": "serial",
                                    "categoryField": "date",
                                    "path": "bower_components/amcharts/dist/amcharts/",
                                    "valueAxes": [
                                        {
                                            "stackType": "regular",
                                            "gridAlpha": 0.1,
                                            "axisAlpha": 0
                                        }
                                    ],
                                    "startDuration": 1,
                                    "zoomOutButton": {
                                        backgroundColor: '#000000',
                                        backgroundAlpha: 0.15
                                    },
                                    "graphs": [],
                                    "dataProvider": this.energyChartData,
                                    "export": {
                                        "enabled": true,
                                        "libs": {
                                            "path": "bower_components/amcharts/dist/amcharts/plugins/export/libs/"
                                        }
                                    },
                                    "chartCursor": {
                                        "oneBalloonOnly": false
                                    },
                                    "legend": {
                                        "useGraphSettings": true
                                    },
                                    "chartScrollbar": {
                                        "updateOnReleaseOnly": true
                                    }

                                });




                                // GRAPHS
                                // first graph    
                                var keys = groupHash.keys();
                                var key = 0;
                                for (key = 0; key < keys.length; key++)
                                {
                                    var graph = {};
                                    graph.title = keys[key];
                                    graph.balloonText = "[[title]]: [[value]]";
                                    graph.valueField = keys[key];
                                    graph.type = "column";
                                    graph.lineAlpha = 0;
                                    graph.fillAlphas = 1;
                                    graph.lineColor = groupHash[keys[key]];
                                    this.energyChart.addGraph(graph);
                                }
                                
                                // AXES
                                // category
                                var categoryAxis = this.energyChart.categoryAxis;
                                categoryAxis.axisAlpha = 1;
                                categoryAxis.gridAlpha = 0.15;
                                categoryAxis.position = "bottom";
                                categoryAxis.axisColor = "#000000";
                                categoryAxis.dashLength = 1;
                                categoryAxis.parseDates = true;
                                categoryAxis.minPeriod = "DD";


                                var target = {};
                                target.title = "Target Energy (MJ)";
                                target.baloonText = "[[title]]: [[value]]";
                                target.valueField = "Target Energy (MJ)";
                                target.type = "line";
                                target.lineThickness = 2;
                                target.bullet = "round";
                                target.lineColor = "Blue";

                                this.energyChart.addGraph(target);

                                this.energyChart.addListener("dataUpdated", this.zoomEnergyChart);

                            },
                            plotDailyProtein: function () {

                                $("#dailyProtein").text("");

                                var groupHash = new Hash();
                                groupHash["PN Protein Delivered (G)"] = "Red";
                                groupHash["EN Protein Delivered (G)"] = "Green";
                                groupHash["ON Protein Delivered (G)"] = "Pink";
                                groupHash["Propofol Energy Delivered (MJ)"] = "Purple";


                                this.proteinChart = AmCharts.makeChart("dailyProtein", {
                                    "type": "serial",
                                    "categoryField": "date",
                                    "path": "bower_components/amcharts/dist/amcharts/",
                                    "valueAxes": [
                                        {
                                            "stackType": "regular",
                                            "gridAlpha": 0.1,
                                            "axisAlpha": 0
                                        }
                                    ],
                                    "startDuration": 1,
                                    "zoomOutButton": {
                                        backgroundColor: '#000000',
                                        backgroundAlpha: 0.15
                                    },
                                    "graphs": [],
                                    "dataProvider": this.proteinChartData,
                                    "export": {
                                        "enabled": true,
                                        "libs": {
                                            "path": "bower_components/amcharts/dist/amcharts/plugins/export/libs/"
                                        }
                                    },
                                    "chartCursor": {
                                        "oneBalloonOnly": false
                                    },
                                    "legend": {
                                        "useGraphSettings": true
                                    },
                                    "chartScrollbar": {
                                        "updateOnReleaseOnly": true
                                    }

                                });




                                // GRAPHS
                                // first graph    
                                var keys = groupHash.keys();
                                var key = 0;
                                for (key = 0; key < keys.length; key++)
                                {
                                    var graph = {};
                                    graph.title = keys[key];
                                    graph.balloonText = "[[title]]: [[value]]";
                                    graph.valueField = keys[key];
                                    graph.type = "column";
                                    graph.lineAlpha = 0;
                                    graph.fillAlphas = 1;
                                    graph.lineColor = groupHash[keys[key]];
                                    this.proteinChart.addGraph(graph);
                                }
                                
                                // AXES
                                // category
                                var categoryAxis = this.proteinChart.categoryAxis;
                                categoryAxis.axisAlpha = 1;
                                categoryAxis.gridAlpha = 0.15;
                                categoryAxis.position = "bottom";
                                categoryAxis.axisColor = "#000000";
                                categoryAxis.dashLength = 1;
                                categoryAxis.parseDates = true;
                                categoryAxis.minPeriod = "DD";


                                var target = {};
                                target.title = "Target Protein (G)";
                                target.baloonText = "[[title]]: [[value]]";
                                target.valueField = "Target Protein (G)";
                                target.type = "line";
                                target.lineThickness = 2;
                                target.bullet = "round";
                                target.lineColor = "Blue";

                                this.proteinChart.addGraph(target);

                                this.proteinChart.addListener("dataUpdated", this.zoomProteinChart);


                            },
                            plotCumulEnergy: function () {
                                $("#cumulativeEnergy").text("");
                                
                                this.cumulEnergyChart = AmCharts.makeChart("cumulativeEnergy", {
                                    "type": "serial",
                                    "categoryField": "date",
                                    "path": "bower_components/amcharts/dist/amcharts/",
                                    "valueAxes": [
                                        {
                                            "stackType": "none",
                                            "gridAlpha": 0.1,
                                            "axisAlpha": 0
                                        }
                                    ],
                                    "startDuration": 1,
                                    "zoomOutButton": {
                                        backgroundColor: '#000000',
                                        backgroundAlpha: 0.15
                                    },
                                    "graphs": [],
                                    "dataProvider": this.targetEnergyChartData,
                                    "export": {
                                        "enabled": true,
                                        "libs": {
                                            "path": "bower_components/amcharts/dist/amcharts/plugins/export/libs/"
                                        }
                                    },
                                    "chartCursor": {
                                        "oneBalloonOnly": false
                                    },
                                    "legend": {
                                        "useGraphSettings": true
                                    },
                                    "chartScrollbar": {
                                        "updateOnReleaseOnly": true
                                    }

                                });




                                
                                // AXES
                                // category
                                var categoryAxis = this.cumulEnergyChart.categoryAxis;
                                categoryAxis.axisAlpha = 1;
                                categoryAxis.gridAlpha = 0.15;
                                categoryAxis.position = "bottom";
                                categoryAxis.axisColor = "#000000";
                                categoryAxis.dashLength = 1;
                                categoryAxis.parseDates = true;
                                categoryAxis.minPeriod = "DD";


                                var target = {};
                                target.title = "Target Energy (MJ)";
                                target.baloonText = "[[title]]: [[value]]";
                                target.valueField = "Target Energy (MJ)";
                                target.type = "line";
                                target.lineThickness = 2;
                                target.bullet = "round";
                                target.lineColor = "Orange";
                                
                                                                var delivered = {};
                                delivered.title = "Delivered Energy (MJ)";
                                delivered.balloonText = "[[title]]: [[value]]";
                                delivered.valueField = "Delivered Energy (MJ)";
                                delivered.type = "line";
                                delivered.lineThickness = 2;
                                delivered.bullet = "round";
                                delivered.lineColor = "Blue";


                                this.cumulEnergyChart.addGraph(target);
                                 this.cumulEnergyChart.addGraph(delivered);

                                this.cumulEnergyChart.addListener("dataUpdated", this.zoomCumulEnergyChart);
                                



                            },
                            plotCumulProtein: function () {
                                $("#cumulativeProtein").text("");

                                this.cumulProteinChart = new AmCharts.makeChart("cumulativeProtein", {
                                    "type": "serial",
                                    "categoryField": "date",
                                    "path": "bower_components/amcharts/dist/amcharts/",
                                    "valueAxes": [
                                        {
                                            "stackType": "none",
                                            "gridAlpha": 0.1,
                                            "axisAlpha": 0
                                        }
                                    ],
                                    "startDuration": 1,
                                    "zoomOutButton": {
                                        backgroundColor: '#000000',
                                        backgroundAlpha: 0.15
                                    },
                                    "graphs": [],
                                    "dataProvider": this.targetProteinChartData,
                                    "export": {
                                        "enabled": true,
                                        "libs": {
                                            "path": "bower_components/amcharts/dist/amcharts/plugins/export/libs/"
                                        }
                                    },
                                    "chartCursor": {
                                        "oneBalloonOnly": false
                                    },
                                    "legend": {
                                        "useGraphSettings": true
                                    },
                                    "chartScrollbar": {
                                        "updateOnReleaseOnly": true
                                    }

                                });
                               
                                // AXES
                                // category
                                var categoryAxis = this.cumulProteinChart.categoryAxis;
                                categoryAxis.axisAlpha = 1;
                                categoryAxis.gridAlpha = 0.15;
                                categoryAxis.position = "bottom";
                                categoryAxis.axisColor = "#000000";
                                categoryAxis.dashLength = 1;
                                categoryAxis.parseDates = true;
                                categoryAxis.minPeriod = "DD";


                                // GRAPHS
                                // first graph    

                                var delivered = {};
                                delivered.title = "Delivered Protein (G)";
                                delivered.balloonText = "[[title]]: [[value]]";
                                delivered.valueField = "Delivered Protein (G)";
                                delivered.type = "line";
                                delivered.lineThickness = 2;
                                delivered.bullet = "round";
                                delivered.lineColor = "Blue";

                                var target = {};
                                target.title = "Target Protein (G)";
                                target.balloonText = "[[title]]: [[value]]";
                                target.valueField = "Target Protein (G)";
                                target.lineThickness = 2;
                                target.bullet = "round";
                                target.lineColor = "Orange";
                                target.type = "line";

                                this.cumulProteinChart.addGraph(target);
                                this.cumulProteinChart.addGraph(delivered);
                                

                                this.cumulProteinChart.addListener("dataUpdated", this.zoomCumulProteinChart);
                            },
                            plotNGAsp: function () {
                                $("#gastricAspirate").text("");

                         
                                this.gastricChart = AmCharts.makeChart("gastricAspirate", {
                                    "type": "serial",
                                    "categoryField": "date",
                                    "path": "bower_components/amcharts/dist/amcharts/",
                                    "valueAxes": [
                                        {
                                            "stackType": "none",
                                            "gridAlpha": 0.1,
                                            "axisAlpha": 0
                                        }
                                    ],
                                    "startDuration": 1,
                                    "zoomOutButton": {
                                        backgroundColor: '#000000',
                                        backgroundAlpha: 0.15
                                    },
                                    "graphs": [],
                                    "dataProvider": this.gastricChartData,
                                    "export": {
                                        "enabled": true,
                                        "libs": {
                                            "path": "bower_components/amcharts/dist/amcharts/plugins/export/libs/"
                                        }
                                    },
                                    "chartCursor": {
                                        "oneBalloonOnly": false
                                    },
                                    "legend": {
                                        "useGraphSettings": true
                                    },
                                    "chartScrollbar": {
                                        "updateOnReleaseOnly": true
                                    }

                                });




                                
                                // AXES
                                // category
                                var categoryAxis = this.gastricChart.categoryAxis;
                                categoryAxis.axisAlpha = 1;
                                categoryAxis.gridAlpha = 0.15;
                                categoryAxis.position = "bottom";
                                categoryAxis.axisColor = "#000000";
                                categoryAxis.dashLength = 1;
                                categoryAxis.parseDates = true;
                                categoryAxis.minPeriod = "DD";


                                var target = {};
                                target.title = "Gastric Aspirate (mL)";
                                target.baloonText = "[[title]]: [[value]]";
                                target.valueField = "NG ASP";
                                target.type = "line";
                                target.lineThickness = 2;
                                target.bullet = "round";
                                target.lineColor = "Blue";

                                this.gastricChart.addGraph(target);

                                this.gastricChart.addListener("dataUpdated", this.zoomGastricChart);
                            },
                            getPlottingObjectsForAdmID: function () {
                                
                                                                    $rootScope.print.alerts.pop();
                                $rootScope.print.setAlert('warning', 'Getting Chart data');
                                $timeout(function(){
                                    $rootScope.print.alerts.pop();
                                }, 3000);
                                
                                var pMap = new Hash({
                                    'ID': this.admId
                                }, {
                                    'IDType': 'AdmID'
                                },
                                {
                                    'Sex': this.sex
                                },
                                {
                                    'Age': this.age
                                });
                                getPersistenceObject(true, "getPlottingObjectsForPatient", "../../NutritionNotesDataAccessService/NutritionNotesDataAccessBean", pMap, this.endPlottingObjectsCall);
                            },
                            endPlottingObjectsCall: function (xmlHttpRequest, status) {
                                var plots = [];
                                var xmlDoc = $(xmlHttpRequest.responseXML);
                                var soapBody = xmlDoc.find("return");
                                plots = $($.parseXML(soapBody.text())).find("plot");
                                $scope.progressCharts.plot_dictionary = new Hash();
                                if (plots.length > 0)
                                {

                                    for (i = 0; i < plots.length; i++)
                                    {
                                        var plot = plots[i];
                                        var key = moment($(plot).find("deliveredDate").text(), "YYYY-MM-DD HH:mm:ss '" + $scope.progressCharts.locale + "'").format("ddd DD MMM, YYYY");
                                        $scope.progressCharts.plot_dictionary[key] = plots[i];
                                    }
                                }
                                if ($scope.progressCharts.plot_dictionary.length() > 0)
                                {
                                    $scope.progressCharts.showPlots();
                                }
                                else
                                {
                                    $("#dailyDeficits").text("");
                                    $("#dailyEnergy").text("");
                                    $("#dailyProtein").text("");
                                    $("#cumulativeEnergy").text("");
                                    $("#cumulativeProtein").text("");
                                    $("#gastricAspirate").text("");

                                    $("#summaryCumulativeEnergy").text("");
                                    $("#summaryCumulativeProtein").text("");
                                    $("#summaryGastricAspirate").text("");
                                    $("#summaryCumulativeEnergySml").text("");
                                    $("#summaryCumulativeProteinSml").text("");

                                }
                                
                                $scope.progressCharts.hideOthers('showDeficit');

                            },
                            getPlottingObjectsForICUAdmID: function () {

                            },
                            getPlottingObjectsForPMIID: function () {

                            },
                            getLast5ReviewComments: function () {
                                var pMap = new Hash({
                                    'PMIID': this.pmiId
                                });
                                getPersistenceObject(true, "getPrevious5ReviewCommentsForPatient", "../../NutritionNotesDataAccessService/NutritionNotesDataAccessBean", pMap, this.endLast5ReviewCommentsCall);
                            },
                            endLast5ReviewCommentsCall: function (xmlHttpRequest, status) {
                                //alert("GOT BACK: "+xmlHttpRequest.responseText);
                                var xmlDoc = $(xmlHttpRequest.responseXML);
                                var soapBody = xmlDoc.find("return");
                                var revComments = $($.parseXML(soapBody.text())).find("review");
                                if (revComments.length > 0)
                                {

                                    for (i = revComments.length - 1; i > -1; i--)
                                    {
                                        var inner = revComments[i];
                                        var review = {};
                                        var dt = $(inner).find("reviewDate").text();
                                        var cmt = $(inner).find("reviewComment").text();
                                        
                                        review["date"] = dt;
                                        review["comment"] = cmt;
                                        $rootScope.print.reviews.push(review);
                                        $("#previousReviewComments").append("<br /><label>" + dt + "<label><br /><textarea rows=\"5\" cols=\"30\">" + cmt + "</textarea>");
                                    }
                                }

                            },
                            zoomEnergyChart: function () {
                                this.energyChart.zoomToIndexes(this.energyChartData.length - 40, this.energyChartData.length - 1);
                            },
                            zoomProteinChart: function () {
                                this.proteinChart.zoomToIndexes(this.proteinChartData.length - 40, this.proteinChartData.length - 1);
                            },
                            zoomCumulEnergyChart: function () {
                                this.cumulEnergyChart.zoomToIndexes(this.cumulEnergyChartData.length - 40, this.cumulEnergyChartData.length - 1);
                            },
                            zoomCumulProteinChart: function () {
                                this.cumulProteinChart.zoomToIndexes(this.cumulProteinChartData.length - 40, this.cumulProteinChartData.length - 1);
                            },
                            zoomGastricChart: function () {
                                this.gastricChart.zoomToIndexes(this.gastricChartData.length - 40, this.gastricChartData.length - 1);
                            },
                            showPlots: function () {
                                this.energyChartData = [];
                                this.proteinChartData = [];
                                this.targetEnergyChartData = [];
                                this.targetProteinChartData = [];
                                this.deficitChartData = [];
                                this.gastricChartData = [];
                                this.summaryTargetEnergyChartData = [];
                                this.summaryTargetProteinChartData = [];
                                this.summaryTargetEnergyChartSmlData = [];
                                this.summaryTargetProteinChartSmlData = [];
                                this.deficitChartData = [];
                                this.summaryGastricChartData = [];
                                var keys = this.plot_dictionary.keys();
                                var ticks = new Array();
                                var anpDateSeries = new Array();
                                var enTargetEnergySeries = new Array();
                                var pnTargetEnergySeries = new Array();
                                var onTargetEnergySeries = new Array();
                                var enTargetProteinSeries = new Array();
                                var pnTargetProteinSeries = new Array();
                                var onTargetProteinSeries = new Array();
                                var enDeliveredEnergySeries = new Array();
                                var pnDeliveredEnergySeries = new Array();
                                var propofolDeliveredEnergySeries = new Array();
                                var onDeliveredEnergySeries = new Array();
                                var enDeliveredProteinSeries = new Array();
                                var pnDeliveredProteinSeries = new Array();
                                var onDeliveredProteinSeries = new Array();
                                var totalTargetEnergySeries = new Array();
                                var totalTargetProteinSeries = new Array();
                                var totalDeliveredEnergySeries = new Array();
                                var totalDeliveredProteinSeries = new Array();
                                var dailyEnergyDeficitSeries = new Array();
                                var dailyProteinDeficitSeries = new Array();
                                var cumulativeTargetEnergySeries = new Array();
                                var cumulativeDeliveredEnergySeries = new Array();
                                var cumulativeTargetProteinSeries = new Array();
                                var cumulativeDeliveredProteinSeries = new Array();
                                var cumulativeEnergyDeficitSeries = new Array();
                                var cumulativeProteinDeficitSeries = new Array();

                                var bowelMovementsSeries = new Array();
                                var gastricAspirateSeries = new Array();
                                var cumulativeTargetEnergy = 0.0;
                                var cumulativeDeliveredEnergy = 0.0;
                                var cumulativeTargetProtein = 0.0;
                                var cumulativeDeliveredProtein = 0.0;
                                var cumulativeDailyEnergyDeficit = 0.0;
                                var cumulativeDailyProteinDeficit = 0.0;
                                var k = 0;
                                for (k = 0; k < keys.length; k++)
                                {
                                    ticks[k] = keys[k];
                                    anpDateSeries[k] = moment($(this.plot_dictionary[keys[k]]).find("targetsDate").text(), "YYYY-MM-DD HH:mm:ss '" + this.locale + "'").format("ddd DD MMM, YYYY");
                                    var targetE = parseFloat($(this.plot_dictionary[keys[k]]).find("targetEnergy").text()).toFixed(2);
                                    var deliveredE = parseFloat($(this.plot_dictionary[keys[k]]).find("deliveredEnergy").text()).toFixed(2);
                                    var targetP = parseFloat($(this.plot_dictionary[keys[k]]).find("targetProtein").text()).toFixed(2);
                                    var deliveredP = parseFloat($(this.plot_dictionary[keys[k]]).find("deliveredProtein").text()).toFixed(2);
                                    totalTargetEnergySeries[k] = targetE;
                                    totalDeliveredEnergySeries[k] = deliveredE;
                                    dailyEnergyDeficitSeries[k] = ((deliveredE - targetE) * 100 / targetE).toFixed(2);
                                    dailyProteinDeficitSeries[k] = ((deliveredP - targetP) * 100 / targetP).toFixed(2);
                                    enDeliveredEnergySeries[k] = parseFloat($(this.plot_dictionary[keys[k]]).find("deliveredEnergyEN").text()).toFixed(2);
                                    pnDeliveredEnergySeries[k] = parseFloat($(this.plot_dictionary[keys[k]]).find("deliveredEnergyPN").text()).toFixed(2);
                                    propofolDeliveredEnergySeries[k] = parseFloat($(this.plot_dictionary[keys[k]]).find("deliveredEnergyPropofol").text()).toFixed(2);
                                    onDeliveredEnergySeries[k] = parseFloat($(this.plot_dictionary[keys[k]]).find("deliveredEnergyON").text()).toFixed(2);
                                    enDeliveredProteinSeries[k] = parseFloat($(this.plot_dictionary[keys[k]]).find("deliveredProteinEN").text()).toFixed(2);
                                    pnDeliveredProteinSeries[k] = parseFloat($(this.plot_dictionary[keys[k]]).find("deliveredProteinPN").text()).toFixed(2);
                                    onDeliveredProteinSeries[k] = parseFloat($(this.plot_dictionary[keys[k]]).find("deliveredProteinON").text()).toFixed(2);
                                    enTargetEnergySeries[k] = parseFloat($(this.plot_dictionary[keys[k]]).find("targetEnergyEN").text()).toFixed(2);
                                    pnTargetEnergySeries[k] = parseFloat($(this.plot_dictionary[keys[k]]).find("targetEnergyPN").text()).toFixed(2);
                                    onTargetEnergySeries[k] = parseFloat($(this.plot_dictionary[keys[k]]).find("targetEnergyON").text()).toFixed(2);
                                    enTargetProteinSeries[k] = parseFloat($(this.plot_dictionary[keys[k]]).find("targetProteinEN").text());
                                    pnTargetProteinSeries[k] = parseFloat($(this.plot_dictionary[keys[k]]).find("targetProteinPN").text()).toFixed(2);
                                    onTargetProteinSeries[k] = parseFloat($(this.plot_dictionary[keys[k]]).find("targetProteinON").text()).toFixed(2);
                                    cumulativeTargetEnergy += targetE;
                                    cumulativeDeliveredEnergy += deliveredE;
                                    cumulativeTargetProtein += targetP;
                                    cumulativeDeliveredProtein += deliveredP;
                                    cumulativeDailyEnergyDeficit += dailyEnergyDeficitSeries[k];
                                    cumulativeDailyProteinDeficit += dailyProteinDeficitSeries[k];
                                    cumulativeTargetEnergySeries[k] = cumulativeTargetEnergy;
                                    cumulativeDeliveredEnergySeries[k] = cumulativeDeliveredEnergy;
                                    cumulativeTargetProteinSeries[k] = cumulativeTargetProtein;
                                    cumulativeDeliveredProteinSeries[k] = cumulativeDeliveredProtein;
                                    cumulativeEnergyDeficitSeries[k] = cumulativeDailyEnergyDeficit;
                                    cumulativeProteinDeficitSeries[k] = cumulativeDailyProteinDeficit;
                                    bowelMovementsSeries[k] = parseInt($(this.plot_dictionary[keys[k]]).find("bowelMovements").text());
                                    gastricAspirateSeries[k] = parseInt($(this.plot_dictionary[keys[k]]).find("gastricAspirate").text());
                                    var dat = moment(keys[k]).toDate();
                                    var enDel = parseFloat($(this.plot_dictionary[keys[k]]).find("deliveredEnergyEN").text()).toFixed(2);
                                    var onDel = parseFloat($(this.plot_dictionary[keys[k]]).find("deliveredEnergyON").text()).toFixed(2);
                                    var pnDel = parseFloat($(this.plot_dictionary[keys[k]]).find("deliveredEnergyPN").text()).toFixed(2);
                                    var propDel = parseFloat($(this.plot_dictionary[keys[k]]).find("deliveredEnergyPropofol").text()).toFixed(2);

                                    this.gastricChartData.push(
                                            {
                                                "date": dat,
                                                "NG ASP": gastricAspirateSeries[k]
                                            });

                                    this.summaryGastricChartData.push(
                                            {
                                                "date": dat,
                                                "NG ASP": gastricAspirateSeries[k]
                                            });


                                    this.energyChartData.push({
                                        "date": dat,
                                        "Propofol Energy Delivered (MJ)": propDel,
                                        "ON Energy Delivered (MJ)": onDel,
                                        "PN Energy Delivered (MJ)": pnDel,
                                        "EN Energy Delivered (MJ)": enDel,
                                        "Target Energy (MJ)": targetE
                                    });

                                    this.proteinChartData.push({
                                        "date": dat,
                                        "ON Protein Delivered (G)": onDeliveredProteinSeries[k],
                                        "PN Protein Delivered (G)": pnDeliveredProteinSeries[k],
                                        "EN Protein Delivered (G)": enDeliveredProteinSeries[k],
                                        "Target Protein (G)": targetP
                                    });

                                    this.targetEnergyChartData.push({
                                        "date": dat,
                                        "Target Energy (MJ)": cumulativeTargetEnergy,
                                        "Delivered Energy (MJ)": cumulativeDeliveredEnergy
                                    });

                                    this.targetProteinChartData.push({
                                        "date": dat,
                                        "Target Protein (G)": cumulativeTargetProtein,
                                        "Delivered Protein (G)": cumulativeDeliveredProtein
                                    });

                                    this.summaryTargetEnergyChartData.push({
                                        "date": dat,
                                        "Target Energy (MJ)": cumulativeTargetEnergy,
                                        "Delivered Energy (MJ)": cumulativeDeliveredEnergy
                                    });

                                    this.summaryTargetProteinChartData.push({
                                        "date": dat,
                                        "Target Protein (G)": cumulativeTargetProtein,
                                        "Delivered Protein (G)": cumulativeDeliveredProtein
                                    });

                                    this.summaryTargetEnergyChartSmlData.push({
                                        "date": dat,
                                        "Target Energy (MJ)": cumulativeTargetEnergy,
                                        "Delivered Energy (MJ)": cumulativeDeliveredEnergy
                                    });

                                    this.summaryTargetProteinChartSmlData.push({
                                        "date": dat,
                                        "Target Protein (G)": cumulativeTargetProtein,
                                        "Delivered Protein (G)": cumulativeDeliveredProtein
                                    });


                                    this.deficitChartData.push({
                                        "date": dat,
                                        "Energy (%)": parseFloat(dailyEnergyDeficitSeries[k]).toFixed(2),
                                        "Protein (%)": parseFloat(dailyProteinDeficitSeries[k]).toFixed(2),
                                        "Energy Cumulative (%)": parseFloat(cumulativeEnergyDeficitSeries[k]).toFixed(2),
                                        "Protein Cumulative (%)": parseFloat(cumulativeProteinDeficitSeries[k]).toFixed(2)
                                    });
                                }


                                $("#dailyDeficits").text("");
                                this.plotDailyDeficit();

                                $("#dailyProtein").text("");
                                this.plotDailyProtein();

                                $("#dailyEnergy").text("");
                                this.plotDailyEnergy();


                                $("#cumulativeEnergy").text("");
                                this.plotCumulEnergy();

                                $("#cumulativeProtein").text("");
                                this.plotCumulProtein();

                                $("#gastricAspirate").text("");
                                this.plotNGAsp();


                            },
                            print: function(){
                                $rootScope.print.save();
                            }


                        };

                        $scope.progressCharts.onLoad();
                    }
                ]);