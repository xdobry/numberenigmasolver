"use strict";

/* 
 * test tree generators
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

function* paramGen(deep) {
    if (deep==0) {
        for (let p of tg.leafs) {
            yield p;
        }
    } else {
        for (let t of treeGen(deep-1)) {
            yield t;
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

function* treeGenLeftRight(l,r) {
    var root = {};
    for (let par1 of paramGen(l)) {
        for (let par2 of paramGen(r)) {
            root.l = par1;
            root.r = par2;
            yield root;
        }
    }
}

function* treeGenTill(deep) {
    for (let x=0;x<=deep;x++) {
        for (let i=0;i<x;i++) {
            for (let t of treeGenLeftRight(x,i)) { yield t; }
            for (let t of treeGenLeftRight(i,x)) { yield t; }
        }
        for (let t of treeGenLeftRight(x,x)) { yield t; }
    }
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
    
    for (let x=0;x<=4;x++) {
        for (let i=0;i<x;i++) {
            console.info(x+" "+i);
            console.info(i+" "+x);
        }
        console.info(x+" "+x);
    }
});



