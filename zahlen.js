"use strict";

/**
 * GPL License
 * Programmed by Artur Trzewik
 * 
 * Inspired by http://www.spiegel.de/wissenschaft/mensch/raetsel-der-woche-der-taschenrechner-spinnt-a-1077064.html
 */

/**
 * TODO 
 * limit count of nodes (not deep but all)
 * formulas count
 * 0 - 27
 * 1 - 2700
 * 2 - 21.918.627
 * 
 * try to make wide first (now the first argument has full deep, before solving next)
 * try to get exact deep (not max)
 * 
 */
var FORMULAFINDER = (function () {
    var zahlenf = {};
    
    function Operation(name,op,sign) {
        this.name = name;
        this.op = op;
        this.sign = sign;
    }
    
    var operationsDef = [
        new Operation("plus",function(a,b) { 
            return a+b;
        },"+"),
        new Operation("minus",function(a,b) { return a-b;},"-"),
        new Operation("mult",function(a,b) { return a*b;},"*"),
        new Operation("div",function(a,b) { return Math.floor(a/b); },"/"),
        new Operation("reminder",function(a,b) { return a%b;},"%"),
        new Operation("concat",function(a,b) { 
            return parseInt(a.toString()+b.toString());
        },"|")
    ];
    
        
    zahlenf.sucheformel = function(probeArr,options) {
        var parameters = ["a","b"];
    
        function* genParam(deep) {
            if (deep==0) {
                for (let p of parameters) {
                    yield p;
                }
            } else {
                for (let p of genFormulaTill(deep-1)) {
                    yield p;
                }
            }
        }

        function* genFormulaLeftRight(l,r) {
            var root = {};
            for (let par1 of genParam(l)) {
                for (let par2 of genParam(r)) {
                    for (let operation of options.operations) {
                        root.op=operation;
                        root.l = par1;
                        root.r = par2;
                        yield root;
                    }
                }
            }
        }

        function* genFormulaTill(deep) {
            for (let x=0;x<=deep;x++) {
                for (let i=0;i<x;i++) {
                    for (let t of genFormulaLeftRight(x,i)) { yield t; }
                    for (let t of genFormulaLeftRight(i,x)) { yield t; }
                }
                for (let t of genFormulaLeftRight(x,x)) { yield t; }
            }
        }
        
        options = options || {};
        checkOptions(options);
        for (let i=1;i<=options.maxConstant;i++) {
            parameters.push(i);
        }
        
        for (let f of genFormulaTill(options.maxDepth)) {
            if (testProben(f,probeArr)) {
                return f;
            }
        }
    }
    
    function checkOptions(options) {
        if (options.maxDepth===undefined) {
            options.maxDepth = 2;
        }
        if (options.operations===undefined) {
            options.operations = operationsDef;
        }
        if (options.maxConstant===undefined) {
            options.maxConstant = 1;
        }
    }
    
    function testProben(desc,probeArr) {
        for (var i=0;i<probeArr.length;i++) {
            var probe = probeArr[i];
            if (evalFormel(desc,probe[0],probe[1])!==probe[2]) {
                return false;
            }
        };
        return true;
    };

     function evalFormel(desc,a,b) {
        if (typeof desc === "number") {
            return desc;
        } else if (typeof desc === "string") {
            if (desc === "a") {
                return a;
            } else if (desc === "b") {
                return b;
            } else {
                throw "expect string a or b got:"+desc;
            }
        } else {
            var ret = desc.op.op(evalFormel(desc.l,a,b),evalFormel(desc.r,a,b));
            return ret;
        }
    };

    zahlenf.formulaAsString = function(desc) {
        if (desc===undefined) {
            return "undefined";
        }
        function paramAsString(param) {
            if (typeof param === "object") {
                return zahlenf.formulaAsString(param);
            } else {
                return param.toString();
            }
        }
        return "(" + paramAsString(desc.l) + desc.op.sign + paramAsString(desc.r)+ ")";
    }
    
    zahlenf.formulaCount = function(options) {
        options = options || {};
        checkOptions(options);
        
        function countParam(deep) {
            var count = 0;
            if (deep==0) {
                count = 2+options.maxConstant;
            } else {
                count = countFormulaTill(deep-1);
            }
            return count;
        }

        function countFormulaLeftRight(l,r) {
            return countParam(l)*countParam(r)*options.operations.length;
        }

        function countFormulaTill(deep) {
            var count = 0;
            for (let x=0;x<=deep;x++) {
                for (let i=0;i<x;i++) {
                    count += countFormulaLeftRight(x,i);
                    count += countFormulaLeftRight(i,x);
                }
                count += countFormulaLeftRight(x,x);
            }
            return count;
        }
        
        return countFormulaTill(options.maxDepth);
    }
    zahlenf.operations=operationsDef;
    zahlenf.evalFormula=evalFormel;
    
    return zahlenf;
}());



