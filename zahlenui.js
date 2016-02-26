"use strict";

$(document).ready(function() {
    var rowsCount = 6;
    $("#wait").hide();
    var operations = "<div id='operations'>";
    for (let operation of FORMULAFINDER.operations) {
        operations += "<input type='checkbox' name='operation' checked='checked' value='"+operation.name+"'>"+operation.name+"("+operation.sign+")"+"<br>";
    }
    operations += "</div>";
    $("#operations").replaceWith(operations);
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
            setTimeout(function() {
                var start = new Date().getTime();
                var formula = FORMULAFINDER.sucheformel(proben,getOptions());
                var end = new Date().getTime();
                $("#solution").text(FORMULAFINDER.formulaAsString(formula)+ " in seconds: "+((end-start)/1000));
                $("#solve").removeAttr("disabled");
            },0);
        }       
    });
    $("#count").click(function () {
        var count = FORMULAFINDER.formulaCount(getOptions());
        var timeSeconds = count/getOperationsPerSecond();
        $("#solution").text("possible formulas count: "+ count + " computation time in seconds: "+timeSeconds); 
    });
    function getOptions() {
        var opt = {
            operations: [],
            maxOperations: 0
        };
        opt.maxDepth = parseInt($("#treeDept").val());
        opt.maxConstant = parseInt($("#maxConstant").val());
        $("input[name='operation']:checked").each(function() {
            var opname = $(this).val();
            for (let operation of FORMULAFINDER.operations) {
                if (operation.name===opname) {
                    opt.operations.push(operation);
                    break;
                }
            }
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
            [[1,2,3],[2,2,4],[3,3,6]],
            [[1,2,4],[2,1,5],[3,2,8],[1,1,3]],
            [[9,6,1812],[2,1,42],[3,1,62],[3,2,64]],
            [[8,3,510],[9,1,89],[18,7,1124],[12,4,815],[6,2,47]]];
        var i,example=examples[num],len=example.length,row;
        for (i=0;i<len;i++) {
            row = example[i];
            $("#l"+i).val(row[0].toString());
            $("#r"+i).val(row[1].toString());
            $("#e"+i).val(row[2].toString());
        }
        for (i=len;i<rowsCount;i++) {
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
});

