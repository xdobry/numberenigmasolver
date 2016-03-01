"use strict";
/**
 * GPL License
 * Programmed by Artur Trzewik
 * 
 */
importScripts('zahlen.js');

console.info("worker loaded");

onmessage = function(e) {
    console.info("get message in worker");
    var options = e.data.options;
    options.callback = function(formula,testCount) {
        var message = {
            operation: "result",
            formula: formula,
            testCount: testCount
        };
        self.postMessage(message);
    };
    options.progressCallback = function(progress,timeRemainSec) {
        var message = {
            operation: "progress",
            progress: progress,
            timeRemainSec: timeRemainSec
        };
        self.postMessage(message);
    };
    FORMULAFINDER.sucheformel(e.data.proben,options);
    //self.close();
}
