"use strict";

/**
 * GPL License
 * Programmed by Artur Trzewik
 * 
 * Inspired by http://www.spiegel.de/wissenschaft/mensch/raetsel-der-woche-der-taschenrechner-spinnt-a-1077064.html
 */

/**
 * TODO 
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
    
    function countOperations(tree) {
        if (typeof tree === "object") {
            return 1 + countOperations(tree.l) + countOperations(tree.r)
        } else {
            return 0;
        }
    }
        
    zahlenf.sucheformel = function(probeArr,options) {
        var parameters = ["a","b"];
    
        function* genParam(deep,maxop) {
            if (maxop===undefined || maxop>=0) {
                if (deep==0) {
                    for (let p of parameters) {
                        yield p;
                    }
                } else {
                    for (let p of genFormulaTillOneSide(deep-1,maxop)) {
                        yield p;
                    }
                }
            }
        }

        function* genFormulaLeftRight(l,r,maxop) {
            var root = {};
            var parMax = undefined;
            if (maxop!==undefined) {
                parMax = maxop-1;
            }
            for (let par1 of genParam(l,parMax)) {
                var opCount = undefined;
                if (maxop!==undefined) {
                    var opCount = maxop-1-countOperations(par1);
                }
                for (let par2 of genParam(r,opCount)) {
                    for (let operation of options.operations) {
                        root.op=operation;
                        root.l = par1;
                        root.r = par2;
                        yield root;
                    }
                }
            }
        }

        function* genFormulaTill(deep,maxop) {
            for (let x=0;x<=deep;x++) {
                for (let i=0;i<x;i++) {
                    for (let t of genFormulaLeftRight(x,i,maxop)) { yield t; }
                    for (let t of genFormulaLeftRight(i,x,maxop)) { yield t; }
                }
                for (let t of genFormulaLeftRight(x,x,maxop)) { yield t; }
            }
        }
        
        function* genFormulaTillOneSide(deep,maxop) {
            for (let i=0;i<deep;i++) {
                for (let t of genFormulaLeftRight(deep,i,maxop)) { yield t; }
                for (let t of genFormulaLeftRight(i,deep,maxop)) { yield t; }
            }
            for (let t of genFormulaLeftRight(deep,deep,maxop)) { yield t; }
        }
        
        options = options || {};
        checkOptions(options);
        for (let i=1;i<=options.maxConstant;i++) {
            parameters.push(i);
        }
        
        for (let f of genFormulaTill(options.maxDepth,options.maxOperations)) {
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
    
    function operationsForDepth(depth) {
        if (depth>=0) {
            return (2<<depth)-1;
        } else {
            return 0;
        }
    }
    
    zahlenf.formulaCount = function(options) {
        options = options || {};
        checkOptions(options);
        
        function countParam(deep,opcount) {
            //console.info("<countParam deep: "+deep+ " opcount: "+opcount);
            var count = 0;
            if (deep==0) {
                count = 2+options.maxConstant;
            } else {
                count = countFormulaTillOneSide(deep-1,opcount);
            }
            //console.info("countParam deep: "+deep+ " opcount: "+opcount + " count:" + count);
            return count;
        }

        function countFormulaLeftRight(l,r,maxop) {
            //console.info("<countFormulaLeftRight l: "+l+ " r: "+r + " maxop: "+maxop);
            var neededOperations = 1+ operationsForDepth(l-1)+operationsForDepth(r-1);
            var count = 0;
            if (maxop===undefined || neededOperations<=maxop) {
                count = countParam(l)*countParam(r)*options.operations.length;
            } else {
                if (l+r+1<=maxop) {
                    for (var lopts = l;lopts<maxop-r+1 && maxop-lopts>r;lopts++) {
                        count += countFormularLeftOptsRightOpts(l,lopts,r,maxop-lopts-1);
                    }
                }
            }
            //console.info("countFormulaLeftRight l: "+l+ " r: "+r + " maxop: "+maxop+ " count:" + count);
            return count;
        }
        
        function countFormularLeftOptsRightOpts(l,lopts,r,ropts) {
            var count=0;
            //console.info("<countFormularLeftOptsRightOpts l: "+l+ " lops: "+ lopts +" r: "+r + " rops: "+ropts);
            count = countParam(l,lopts)*countParam(r,ropts)*options.operations.length;
            //console.info("countFormularLeftOptsRightOpts l: "+l+ " lops: "+ lopts +" r: "+r + " rops: "+ropts+ " count:" + count);
            return count;
        }

        function countFormulaTill(deep,maxop) {
            var count = 0;
            for (let x=0;x<=deep;x++) {
                for (let i=0;i<x;i++) {
                    count += countFormulaLeftRight(x,i,maxop) * 2;
                }
                count += countFormulaLeftRight(x,x,maxop);
            }
            return count;
        }
        
        function countFormulaTillOneSide(deep,opcount) {
            var count = 0;
            //console.info("<countFormulaTillOneSide deep: "+deep+ " opcount: "+opcount);
            if (opcount===undefined) {
                for (let i=0;i<deep;i++) {
                    count += countFormulaLeftRight(deep,i,opcount) * 2;
                }
                count += countFormulaLeftRight(deep,deep,opcount);
            } else {
                var minOps = deep+1;
                var maxOps = operationsForDepth(deep);
                for (let lops = minOps; lops<=maxOps && lops<=opcount; lops++) {
                    for (let i=0;i<deep;i++) {
                        count += countFormularLeftOptsRightOpts(deep,lops,i,opcount-lops) * 2;
                    }
                    count += countFormularLeftOptsRightOpts(deep,lops,deep,opcount-lops);
                }
            }
            //console.info("countFormulaTillOneSide deep: "+deep+ " opcount: "+opcount+ " count:" + count);
            return count;
        }
        
        return countFormulaTill(options.maxDepth,options.maxOperations);
    }
    zahlenf.operations=operationsDef;
    zahlenf.evalFormula=evalFormel;
    
    return zahlenf;
}());



