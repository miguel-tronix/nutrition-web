/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function getPersistenceObject(async, serviceName, serviceEndPoint, paramMap, returnCall)
{

    var soapmsg = '<?xml version="1.0" encoding="UTF-8"?>' +
            '<S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/">' +
            '<S:Header/>' +
            '<S:Body>' +
            '<ns2:' + serviceName + ' xmlns:ns2="http://tempuri.org">';

    keys = paramMap.keys();
    for (i in keys)
    {
        soapmsg += '<' + keys[i] + '>' + paramMap[keys[i]] + '</' + keys[i] + '>'
    }
    soapmsg += '</ns2:' + serviceName + '>' +
            '</S:Body>' +
            '</S:Envelope>';

    $.ajax({
        url: serviceEndPoint,
        type: "POST",
        dataType: "xml",
        data: soapmsg,
        complete: returnCall,
        contentType: "text/xml; charset=\"utf-8\"",
        async: async
    });
}

function                             setParamsForObject(xmlObj, obj) {
    $(xmlObj).children().each(function ()
    {
               var node = $(this).get(0).nodeName;
        var text = $(this).text();
        var type = $(this).attr("type");
        if (type !== null || type !== undefined)
        {
            if (type.search(/date/i) > 0)
            {
                var locale = text.split(" ")[2];
                obj["locale"] = locale;
                text = moment(text,"YYYY-MM-DD HH:mm:ss '"+locale+"'").toDate();
            }
            if (type.search(/boolean/i) > 0) {
                if(angular.isDefined($("#"+node)[0]))
                    $("#" + node)[0].checked = eval(text);
            }
            /*if (type.search(/integer/i) > 0) {
                text = parseInt(text);
            }
            if (type.search(/double/i) > 0) {
                text = parseFloat(text);
            }*/
        }
        if(angular.isDefined(obj[node]))
            obj[node] = text;
        else
            obj["'"+node+"'"] = text;
        //$("#" + node).val(text);
    });
}


function buildXMLURIEncodedString(obj, match)
{
    var xmlstr = "&lt;" + $(obj).get(0).nodeName + " type='" + $(obj).attr("type") + "'&gt;";

    $(obj).children().each(function ()
    {
        var node = $(this).get(0).nodeName;
        var type = $(this).attr("type");
        var val = $(this).text();
        if (type.search(/boolean/i) > 0) {
            //alert(node+" "+document.getElementById(node).checked);
            val = typeof match[node] === "undefined" ? false : match[node];
        }
        xmlstr += "&lt;" + node + " type='" + type + "'&gt;" + val + "&lt;/" + node + "&gt;";

    });

    xmlstr += "&lt;/" + $(obj).get(0).nodeName + "&gt;";

    return xmlstr;
}

function createObjectOfType(obj, to)
{
    $(obj).children().each(function ()
    {
        var node = $(this).get(0).nodeName;
        var val = to[node];
        var locale = to["locale"];
        var type = $(this).attr("type");
        if (type !== null || type !== undefined)
        {
            if (type.search(/date/i) > 0)
            {
                if(typeof val === 'undefined')
                    val = null;
                else
                    val = moment(val).format("YYYY-MM-DD HH:mm:ss") + " "+locale;

            }
            if (type.search(/boolean/i) > 0)
            {
                console.log(val+" "+type);
                if( val === "undefined")
                    val = "false";
                else
                {
                    if(val)
                        val = "true";
                    else
                        val = "false";
                }
                //console.log(moment().format("YYYY-MM-DD HH:mm:ss EST"));

            }
            
        }
        console.log(val);
        obj.find(node).text(val === '' ? null : val);

    });
}

function setObjectToWebService(async, xmlstr, serviceName, serviceEndPoint, callback)
{
    var soapmsg = '<?xml version="1.0" encoding="UTF-8"?>' +
            '<S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/">' +
            '<S:Header/>' +
            '<S:Body>' +
            '<ns2:' + serviceName + ' xmlns:ns2="http://tempuri.org">' +
            '<xml>' + xmlstr + '</xml>' +
            '</ns2:' + serviceName + '>' +
            '</S:Body>' +
            '</S:Envelope>';

    //alert("Soapmsg before ajax call: " + soapmsg);

    $.ajax({
        url: serviceEndPoint,
        type: "POST",
        dataType: "xml",
        data: soapmsg,
        complete: callback,
        contentType: "text/xml; charset=\"utf-8\"",
        async: async
    });
}

function parseDate(input) {
    var parts = input.match(/(\d+)/g);
    // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[0], parts[1] - 1, parts[2]); // months are 0-based
}


