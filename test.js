"use strict";
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

QUnit.test("init", function (assert) {
    assert.equal(1, 1, "Just test");
    var probe = [[1,2,3],[2,2,4],[3,3,6]];
    var solution = FORMULAFINDER.sucheformel(probe,0);
    assert.ok(solution!==undefined,"easy addition");
    assert.equal(solution.op.name,"plus","solution should be plus");
    assert.equal(FORMULAFINDER.formulaAsString(solution),"(a+b)","formula a+b");
    
    assert.ok(FORMULAFINDER.formelCount(0)>0,"formula count");
    
    // (a+a)+b
    probe = [[1,2,4],[2,1,5],[3,2,8],[1,1,3]];
    var solution = FORMULAFINDER.sucheformel(probe,1);
    assert.ok(solution!==undefined,"found (a+a)+b");
    assert.equal(FORMULAFINDER.formulaAsString(solution),"((a+a)+b)","formula ((a+a)+b)");
    
    
    // ((a+a)|(b+b))
    probe = [[9,6,1812],[2,1,42],[3,1,62],[3,2,64]];
    var solution = FORMULAFINDER.sucheformel(probe,1);
    assert.ok(solution!==undefined,"found (a+a)|(b+b)");
    assert.equal(FORMULAFINDER.formulaAsString(solution),"((a+a)|(b+b))","formula ((a+a)|(b+b))");

    // ((a-b)|(a+(b-1))
    probe = [[8,3,510],[9,1,89],[18,7,1124],[12,4,815],[6,2,47]];
    solution = FORMULAFINDER.sucheformel(probe,2);
    assert.ok(solution!==undefined,"test ((a-b)|(a+(b-1))");
    assert.equal(FORMULAFINDER.formulaAsString(solution),"((a-b)|((a+b)-1))","formula ((a-b)|(a+(b-1))");
});