"use strict";

/**
 * GPL License
 * Programmed by Artur Trzewik
 */
$(document).ready(function() {
    var rowsCount = 6;
    $("#solutionsadd").hide();
    var operations = "<div id='operations'>";
    for (let operation of FORMULAFINDER.operations) {
        operations += "<label><input type='checkbox' name='operation' checked='checked' value='"+operation.name+"'>"+operation.name+"("+operation.sign+")"+"</label><br>";
    }
    operations += "</div>";
    $("#operations").replaceWith(operations);
    $("#addRandom").click(function() {
        for (var i=0;i<rowsCount;i++) {
            var l = $("#l"+i).val();
            if (!l) {
                $("#l"+i).val(Math.floor(Math.random()*40).toString());
                $("#r"+i).val(Math.floor(Math.random()*40).toString());
                $("#e"+i).val(Math.floor(Math.random()*40).toString());
                break;
            }
        }
    });
    function displayTimeFromMillis(millis) {
        var seconds = Math.floor(millis/1000);
        if (seconds<120) {
            return Math.round(seconds) + " seconds";
        }
        var minutes = Math.floor(seconds/60);
        if (minutes<60) {
            return minutes + " min " + seconds%60 + " sec";
        }
        var hours = Math.floor(minutes/60);
        if (hours<24) {
            return hours + " h " + minutes%60 + " min " + seconds%60 + " sec";
        }
        var days = Math.floor(hours/24);
        if (days<364) {
            return days + " days " + hours%24 + " h " + minutes%60 + " min " + seconds%60 + " sec";
        }
        var years = Math.floor(days/364);
        return yeard + " years " + days%364 + " days " + hours%24 + " h " + minutes%60 + " min " + seconds%60 + " sec";
    }
    $("#solve").click(function() {
        var i,proben = [];
        for (i=0;i<=rowsCount;i++) {
            var l = $("#l"+i).val();
            var r = $("#r"+i).val();
            var e = $("#e"+i).val();
            if (l && r && e) {
                proben.push([parseInt(l),parseInt(r),parseInt(e)]);
            }
        }
        if (proben.length>0) {
            $("#solve").attr("disabled", "disabled");
            $("#solution").text("searching formula (wait...)");
            $("#progress").attr("value",0);
            $("#remainTime").text("");
            $("#solutionsadd").hide();
            
            var worker = new Worker("solverworker.js");
            var start = new Date().getTime();
            
            worker.onerror = function(e) {
                console.info('ERROR: Line '+ e.lineno+ ' in '+ e.filename+ ' : '+ e.message);
            };

            worker.onmessage = function(e) {
                switch (e.data.operation) {
                    case "result":
                        var end = new Date().getTime();
                        var formula = e.data.formula;
                        var testCount = e.data.testCount;
                        $("#solution").text(FORMULAFINDER.formulaAsString(formula));
                        $("#solutionsadd").show();
                        $("#solutionTime").text(displayTimeFromMillis(end-start));
                        $("#solutionCount").text(testCount.toString());
                        $("#solve").removeAttr("disabled");
                        if (formula!==undefined) {
                            var le = $("#le").val();
                            var re = $("#re").val();
                            if (le && re) {
                                $("#ee").text(FORMULAFINDER.evalFormula(formula,parseInt(le),parseInt(re)));
                            }
                        }
                        $("#progress").attr("value",0);
                        $("#remainTime").text("");
                        break;
                    case "progress":
                        $("#progress").attr("value",e.data.progress);
                        $("#remainTime").text(displayTimeFromMillis(e.data.timeRemainSec*1000));
                    default:
                        throw "unknown operation "+e.data.operation;
                };
            };
            
            var options = getOptions();
            worker.postMessage({options: options, proben: proben});
        }       
    });
    $("#count").click(function () {
        var count = FORMULAFINDER.formulaCount(getOptions());
        var timeSeconds = count/getOperationsPerSecond();
        $("#solutionsadd").hide();
        $("#solution").text("possible formulas count: "+ count + " computation time: "+displayTimeFromMillis(timeSeconds*1000)); 
    });
    function getOptions() {
        var opt = {
            oppnames: [],
            maxOperations: undefined,
        };
        opt.maxDepth = parseInt($("#treeDept").val());
        opt.maxConstant = parseInt($("#maxConstant").val());
        var maxOperations = $("#maxOperations").val();
        if (maxOperations!=="" && maxOperations!=="0") {
            opt.maxOperations = parseInt(maxOperations);
        }
        $("input[name='operation']:checked").each(function() {
            var opname = $(this).val();
            opt.oppnames.push(opname);
        });
        return opt;
    }
    var operationPerSecond = undefined;
    function getOperationsPerSecond() {
        if (operationPerSecond===undefined) {
            var probe = [[8,3,510],[9,1,89],[18,7,1124],[8,3,510]];
            var start = new Date().getTime();
            FORMULAFINDER.sucheformel(probe,{maxDepth:1});
            var end = new Date().getTime();
            var count = FORMULAFINDER.formulaCount({maxDepth:1})
            operationPerSecond = (count*1000)/(end-start);
        }
        return operationPerSecond;
    }
    function setExample(num) {
        var examples = [
            [[1,2,3],[2,2,4],[3,3,6],[4,1,undefined]],
            [[1,2,4],[2,1,5],[3,2,8],[1,1,3],[2,3,undefined]],
            [[6,4,210],[9,2,711],[8,5,313],[5,2,37],[7,6,undefined]],
            [[8,3,510],[9,1,89],[18,7,1124],[12,4,815],[6,2,undefined]]];
        var i,example=examples[num],len=example.length,row,shift=0;
        for (i=0;i<len;i++) {
            row = example[i];
            if (row[2]===undefined) {
                $("#le").val(row[0].toString());
                $("#re").val(row[1].toString());
                $("#ee").text("?");
                shift = -1;
            } else {
                $("#l"+i).val(row[0].toString());
                $("#r"+i).val(row[1].toString());
                $("#e"+i).val(row[2].toString());
            }
        }
        for (i=len+shift;i<rowsCount;i++) {
            $("#l"+i).val("");
            $("#r"+i).val("");
            $("#e"+i).val("");
        }
    }
    $("#clean").click(function() {
        for (i=0;i<rowsCount;i++) {
            $("#l"+i).val("");
            $("#r"+i).val("");
            $("#e"+i).val("");
        }
    });
    for (var i=0;i<4;i++) {
        $("#example"+i).click(getExampleFun(i));
    }
    function getExampleFun(num) {
        return function() {setExample(num);};
    }
    setExample(2);
});

