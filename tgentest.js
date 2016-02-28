"use strict";

/**
 * GPL License
 * Programmed by Artur Trzewik
 * 
 * Here only some test code to prove and develop tree generations algoritms
 */


var tg = {};

tg.leafs = ["a","b"];

tg.treeAsString= function(tree) {
    function paramAsString(param) {
        if (typeof param === "object") {
            return tg.treeAsString(param);
        } else {
            return param;
        }
    }
    return "("+paramAsString(tree.l)+","+paramAsString(tree.r)+")";
}

function* paramGen(deep,maxop) {
    if (maxop===undefined || maxop>=0) {
        if (deep==0) {
            for (let p of tg.leafs) {
                yield p;
            }
        } else {
            for (let t of treeGenTillOneSide(deep-1,maxop)) {
                yield t;
            }
        }
    }
}

function* treeGen(deep) {
    var root = {};
    for (let par1 of paramGen(deep)) {
        for (let par2 of paramGen(deep)) {
            root.l = par1;
            root.r = par2;
            yield root;
        }
    }
}

function countOperations(tree) {
    if (typeof tree === "object") {
        return 1 + countOperations(tree.l) + countOperations(tree.r)
    } else {
        return 0;
    }
}

function* treeGenLeftRight(l,r,maxop) {
    var root = {};
    var parMax = undefined;
    if (maxop!==undefined) {
        parMax = maxop-1;
    }
    for (let par1 of paramGen(l,parMax)) {
        var opCount = undefined;
        if (maxop!==undefined) {
            var opCount = maxop-1-countOperations(par1);
        }
        for (let par2 of paramGen(r,opCount)) {
            root.l = par1;
            root.r = par2;
            yield root;
        }
    }
}

function* treeGenTill(deep,maxop) {
    for (let x=0;x<=deep;x++) {
        for (let i=0;i<x;i++) {
            for (let t of treeGenLeftRight(x,i,maxop)) { yield t; }
            for (let t of treeGenLeftRight(i,x,maxop)) { yield t; }
        }
        for (let t of treeGenLeftRight(x,x,maxop)) { yield t; }
    }
}

function* treeGenTillOneSide(deep,maxop) {
    for (let i=0;i<deep;i++) {
        for (let t of treeGenLeftRight(deep,i,maxop)) { yield t; }
        for (let t of treeGenLeftRight(i,deep,maxop)) { yield t; }
    }
    for (let t of treeGenLeftRight(deep,deep,maxop)) { yield t; }
}

function* idMaker() {
  var index = 0;
  while(true)
    yield index++;
}


QUnit.test("init", function (assert) {
    var gen = idMaker();
    assert.equal(gen.next().value,0,"first");
    assert.equal(gen.next().value,1,"secound");
    
    var alltries = treeGen(0);
    var n = alltries.next();
    while (!n.done) {
        console.info(tg.treeAsString(n.value));
        n = alltries.next();
    }
    
    console.info("tree 1")
    for (let t of treeGen(1)) { console.info(tg.treeAsString(t)); }

    console.info("tree till 1")
    for (let t of treeGenTill(1)) { console.info(tg.treeAsString(t)); }
    
    var trees = new Map();
    var count = 0;
    var countTill4 = 0;
    for (let t of treeGenTill(2)) { 
        if (countOperations(t)<=4) {
            countTill4++;
        }
        trees.set(tg.treeAsString(t),1);
        count++;
    }
    assert.equal(trees.size,count,"unique produced trees");
    console.info("found trees of 2 "+trees.size + " produced "+count);
    
    console.info("tree till 2 max 4");
    trees = new Map();
    count = 0;
    for (let t of treeGenTill(2,4)) { 
        trees.set(tg.treeAsString(t),1);
        console.info(tg.treeAsString(t)); 
        count++;
    }
    console.info("found trees of 2 (max 4): "+trees.size + " produced "+count + " counter all till 4: "+countTill4);
    assert.equal(trees.size,countTill4,"unique produced trees max 4 depth 2");

});



