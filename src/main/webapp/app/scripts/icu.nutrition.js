/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var plot_dictionary = new Hash();

var chart;
var deficitChart;
var energyChart;
var proteinChart;
var cumulEnergyChart;
var cumulProteinChart;
var gastricChart;
var energyChartData = [];
var proteinChartData = [];
var deficitChartData = [];
var targetEnergyChartData = [];
var targetProteinChartData = [];
var gastricChartData = [];
var outputChartData = [];
var energyChartCursor;
var proteinChartCursor;
var deficitChartCursor;
var gastricChartCursor;
var cumulativeProteinChartCursor;
var cumulativeEnergyChartCursor;
var groupHash = new Hash();
var outputsHash = new Hash();
var outputsDayHash = new Hash();
var today = new Date();




function parseDate(input) {
    var parts = input.match(/(\d+)/g);
    // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[0], parts[1] - 1, parts[2]); // months are 0-based
}
;
function endSave(xmlHttpRequest, status) {

    //alert("GOT BACK: "+xmlHttpRequest.responseText);
    var xmlDoc = $(xmlHttpRequest.responseXML);
    var soapBody = xmlDoc.find("return");
    var result = soapBody.text();
    if (result !== "success")
    {
        alert("Error on save! Error msg: " + soapBody.text());
    }
    else
    {
        alert("Saved!");
    }
}




function getPlottingObjectsForSummary()
{
    pMap = new Hash({
        'ID': admId
    }, {
        'IDType': 'AdmID'
    },
    {
        'Sex': sex
    },
    {
        'Age': age
    });
    getPersistenceObject(true, "getPlottingObjectsForPatient", "../../NutritionNotesDataAccessService/NutritionNotesDataAccessBean", pMap, endPlottingObjectsCall);
}

function getPlottingObjectsForICUAdmID()
{
    if (isNaN(icuAdmId))
    {
        getPlottingObjectsForAdmID();
    }
    else
    {
        pMap = new Hash({
            'ID': icuAdmId
        }, {
            'IDType': 'ICUAdmID'
        },
        {
            'Sex': sex
        },
        {
            'Age': age
        });
        getPersistenceObject(true, "getPlottingObjectsForPatient", "../../NutritionNotesDataAccessService/NutritionNotesDataAccessBean", pMap, endPlottingObjectsCall);
    }
}

function getPlottingObjectsForAdmID()
{
    pMap = new Hash({
        'ID': admId
    }, {
        'IDType': 'AdmID'
    },
    {
        'Sex': sex
    },
    {
        'Age': age
    });
    getPersistenceObject(true, "getPlottingObjectsForPatient", "../../NutritionNotesDataAccessService/NutritionNotesDataAccessBean", pMap, endPlottingObjectsCall);
}

function getPlottingObjectsForPMIID()
{
    pMap = new Hash({
        'ID': ur
    }, {
        'IDType': 'PMIID'
    },
    {
        'Sex': sex
    },
    {
        'Age': age
    });
    getPersistenceObject(true, "getPlottingObjectsForPatient", "../../NutritionNotesDataAccessService/NutritionNotesDataAccessBean", pMap, endPlottingObjectsCall);
}



function getLast5ReviewComments()
{

    pMap = new Hash({
        'PMIID': ur
    });
    getPersistenceObject(true, "getPrevious5ReviewCommentsForPatient", "../../NutritionNotesDataAccessService/NutritionNotesDataAccessBean", pMap, endLast5ReviewCommentsCall);
}




function setupSummaryView()
{
    var mostRecentPlan = anp_dictionary[anp_dictionary.keys()[0]];
    getPlan(anp_dictionary.keys()[0]);
    var enTargetRate = parseInt($(mostRecentPlan).find("eNTarget").text());
    var pnTargetRate = parseInt($(mostRecentPlan).find("pNTargetRate").text());
    var plnWeight = parseInt($(mostRecentPlan).find("weight").text());
    $("#weightPrint").val(plnWeight);
    var plnHeight = parseInt($(mostRecentPlan).find("heightCm").text());
    $("#heightCmPrint").val(plnHeight);
    var plnBMI = $("#BMI").val();
    $("#BMIPrint").val(plnBMI);
    var plnTargetBMI = $(mostRecentPlan).find("adjustedCalcMethod").text();
    $("#adjustedCalcMethodPrint").val(plnTargetBMI);
    var plnTargetWeight = $("#adjustedWeight").val();
    $("#adjustedWeightPrint").val(plnTargetWeight);

    var plnStress = parseFloat($(mostRecentPlan).find("stressFactor").text());
    $("#stressFactorPrint").val(plnStress);
    var plnActivity = parseFloat($(mostRecentPlan).find("activityFactor").text());
    $("#activityFactorPrint").val(plnActivity);
    var plnRmr = parseFloat($(mostRecentPlan).find("rmr").text());
    $("#rmrPrint").val(plnRmr);
    var plnEq = $("#equation").val();
    $("#equationPrint").val(plnEq);
    var plnProteinReq = $("#proteinRequirement").val();
    $("#proteinRequirementPrint").val(plnProteinReq);
    var plnSchofield = $("#schofieldMidCalc").val();
    $("#schofieldMidCalcPrint").val(plnSchofield);
    var plnDate = $("#assesmentDate").val();
    $("#assesmentDatePrint").val(plnDate);
    var plnDietician = $("#assessmentDietician").val();
    $("#assessmentDieticianPrint").val(plnDietician);

    if (enTargetRate > 0)
    {
        $("#sumEnTargetRate").val($(mostRecentPlan).find("eNTarget").text());
        $("#sumEnTargetHours").val($(mostRecentPlan).find("eNHoursFeed").text());
        var ef_id = parseInt($(mostRecentPlan).find("eNFormula").text());
        var ef_option = "eNFormula_" + ef_id;
        var ef_txt = document.getElementById(ef_option).innerHTML;
        $("#sumEnFormula").val(ef_txt);
        $("#sumEnTargetRate").parent().attr("style", "display:list-item;visibility:visible");
        $("#sumEnTargetHours").parent().attr("style", "display:list-item;visibility:visible");
        $("#sumEnFormula").parent().attr("style", "display:list-item;visibility:visible");
        //Printing
        $("#sumEnTargetRatePrint").val($(mostRecentPlan).find("eNTarget").text());
        $("#sumEnTargetHoursPrint").val($(mostRecentPlan).find("eNHoursFeed").text());
        $("#sumEnFormulaPrint").val(ef_txt);
        $("#sumEnTargetRatePrint").parent().attr("style", "display:table-cell;visibility:visible");
        $("#sumEnTargetHoursPrint").parent().attr("style", "display:table-cell;visibility:visible");
        $("#sumEnFormulaPrint").parent().attr("style", "display:table-cell;visibility:visible");

    }
    else
    {
        $("#sumEnTargetRate").parent().attr("style", "display:none;visibility:hidden");
        $("#sumEnTargetHours").parent().attr("style", "display:none;visibility:hidden");
        $("#sumEnFormula").parent().attr("style", "display:none;visibility:hidden");
        //Printing
        $("#sumEnTargetRatePrint").parent().attr("style", "display:none;visibility:hidden");
        $("#sumEnTargetHoursPrint").parent().attr("style", "display:none;visibility:hidden");
        $("#sumEnFormulaPrint").parent().attr("style", "display:none;visibility:hidden");
    }
    if (pnTargetRate > 0)
    {
        $("#sumPnTargetRate").val($(mostRecentPlan).find("pNTargetRate").text());
        $("#sumPnTargetHours").val($(mostRecentPlan).find("pNHoursFeed").text());
        var pf_id = parseInt($(mostRecentPlan).find("pNFormula").text());
        var pf_option = "pNFormula_" + pf_id;
        var pf_txt = document.getElementById(pf_option).innerHTML;
        $("#sumPnFormula").val(pf_txt);
        $("#sumPnTargetRate").parent().attr("style", "display:list-item;;visibility:visible");
        $("#sumPnTargetHours").parent().attr("style", "display:list-item;;visibility:visible");
        $("#sumPnFormula").parent().attr("style", "display:list-item;;visibility:visible");
        //Printing
        $("#sumPnTargetRatePrint").val($(mostRecentPlan).find("pNTargetRate").text());
        $("#sumPnTargetHoursPrint").val($(mostRecentPlan).find("pNHoursFeed").text());
        $("#sumPnFormulaPrint").val(pf_txt);
        $("#sumPnTargetRatePrint").parent().attr("style", "display:table-cell;visibility:visible");
        $("#sumPnTargetHoursPrint").parent().attr("style", "display:table-cell;visibility:visible");
        $("#sumPnFormulaPrint").parent().attr("style", "display:table-cell;visibility:visible");
    }
    else
    {
        $("#sumPnTargetRate").parent().attr("style", "display:none;visibility:hidden");
        $("#sumPnTargetHours").parent().attr("style", "display:none;visibility:hidden");
        $("#sumPnFormula").parent().attr("style", "display:none;visibility:hidden");
        //Printing
        $("#sumPnTargetRatePrint").parent().attr("style", "display:none;visibility:hidden");
        $("#sumPnTargetHoursPrint").parent().attr("style", "display:none;visibility:hidden");
        $("#sumPnFormulaPrint").parent().attr("style", "display:none;visibility:hidden");
    }

    getPlottingObjectsForSummary();

}



function printSummary()
{
    $("#tabsmain").attr("style", "visibility:hidden; display:none");
    $("#printSummaryOnly").attr("style", "visibility:visible;display:table-row");
    $("#printGraphsOnly").attr("style", "visibility:hidden;display:none");
    window.print();
    $("#tabsmain").attr("style", "visibility:visible; display:inline");
}
;

function printGraph()
{
    $("#tabsmain").attr("style", "visibility:hidden; display:none");
    $("#printSummaryOnly").attr("style", "visibility:hidden;display:none");
    $("#printGraphsOnly").attr("style", "visibility:visible;display:table-row");
    window.print();
    $("#tabsmain").attr("style", "visibility:visible; display:inline");
}
;



(function ($) {
    $.fn.CanvasHack = function () {
        var canvases = this.find('canvas').filter(function () {
            return $(this).css('position') === 'absolute';
        });

        canvases.wrap(function () {
            var canvas = $(this);
            var div = $('<div />').css({
                position: 'absolute',
                top: canvas.css('top'),
                left: canvas.css('left')
            });
            canvas.css({
                top: '0',
                left: '0'
            });
            return div;
        });

        return this;
    };
})(jQuery);