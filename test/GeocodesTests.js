/*
 * nodeunit unit tests for Geocodes
 */

var Geocodes = require('../src/Geocodes.js');

// mock provider instead of hitting google api
// behavior depends on input loc to easily simulate responses
var simpleMockProvider = {
    geocode: function(providerOpts, loc, cbk, opts) {
        var result = null;
        if ((/^delay/).test(loc)) {
            result = "OVER_QUERY_LIMIT";
        } else if ((/^valid/).test(loc)) {
            result = "OK";
        } else {
            result = "ZERO_RESULTS";
        }
        cbk((/^error/).test(loc) ? {error: "something-bad"} : null, {results: [loc], status: result});
    }
}

exports.testChainLoadingSimple = function(test) {
    var geocodes = new Geocodes(["valid address", "junk address", "valid address 2", "more rubbish"], simpleMockProvider);
    geocodes.loadAllAddresses();
    test.deepEqual(geocodes.getResults(), [{results: ["valid address"], status: "OK"}, {results: ["valid address 2"], status: "OK"}]);
    test.done();
}

// this one could probably be better...
//exports.testChainLoadingWithRateLimitDelay = function(test) {
//    var geocodes = new Geocodes(["delay", "delay", "valid 1", "invalid"], simpleMockProvider);
//    geocodes.loadAllAddresses();
// TODO look into async testing capabilities
//}

exports.testErrorEndsProcessing = function(test) {
    var geocodes = new Geocodes(["valid address", "error", "valid address 2", "rubbish"], simpleMockProvider);
    geocodes.loadAllAddresses();
    test.deepEqual(geocodes.getResults(), [{results: ["valid address"], status: "OK"}]);
    test.done();
}

exports.test