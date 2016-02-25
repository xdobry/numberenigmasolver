"use strict";

$(document).ready(function() {
    var rowsCount = 6;
    $("#wait").hide();
    var operations = "<div id='operations'>";
    for (let operation of FORMULAFINDER.operations) {
        operations += "<input type='checkbox' name='operation' value='"+operation.op+"'>"+operation.op+"<br>";
    }
    operations += "</div>";
    $("#operations").replace(operations);
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
             $("#wait").show();
            $("#solve").attr("disabled", "disabled");
            setTimeout(function() {
                var formula = FORMULAFINDER.sucheformel(proben,2);
                $("#solution").text(FORMULAFINDER.formulaAsString(formula));
                $("#wait").hide();
                $("#solve").removeAttr("disabled");
            },0);
        }       
    });
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

