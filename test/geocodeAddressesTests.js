var geocodeAddresses = require('../src/geocodeAddresses');
var geocoder = require('geocoder');

// mock out the bit of the geocoder that interacts with the google api
var apiProvider = {
    // simple mock returns desired code or error based on address input
    geocode: function(providerOpts, loc, cbk, opts) {
        if ((/^err/).test(loc)) {
            cbk({error: 'something bad'}, null);

        } else if ((/^valid/).test(loc)) {
            cbk(null, {results:[{geometry: {location_type: 'ROOFTOP'}, formatted_address: loc}], status: 'OK'});

        } else if ((/^invalid/).test(loc)) {
            cbk(null, {results:[], status: 'ZERO_RESULTS'});

        } else if ((/^limit/).test(loc)) {
            cbk(null, {results:[], status: 'OVER_QUERY_LIMIT'});

        } else {
            cbk(null, {results:[], status: 'UNEXPECTED'});
        }
    }
}

exports.setUp = function(callback) {
    geocoder.providerObj = apiProvider;
    callback();
}

exports.testSingleValidAddress = function(test) {
    test.expect(2);

    geocodeAddresses.geocode(['valid address'], function(err, geocodes) {
        test.equal(geocodes.length, 1);
        test.equal(geocodes[0].results[0].formatted_address, 'valid address');
        test.done();
    });
}

exports.testErrorResponse = function(test) {
    test.expect(1);
    geocodeAddresses.geocode(['error'], function(err, geocodes) {
        test.deepEqual(err, {error: 'something bad'});
        test.done();
    });
}

exports.testSingleInvalid = function(test) {
    test.expect(1);
    geocodeAddresses.geocode(['invalid'], function(err, geocodes) {
        test.equal(geocodes.length, 0);
        test.done();
    });
}

exports.testSingleUnexpected = function(test) {
    test.expect(1);
    geocodeAddresses.geocode(['dfdsfg'], function(err, geocodes) {
        test.deepEqual(err, 'Unexpected status UNEXPECTED from geocoding API.');
        test.done();
    });
}

exports.testErrAfterSuquentialFails = function(test) {
    test.expect(1);
    geocodeAddresses.geocode(['valid 1', 'limit', 'limit', 'limit', 'limit', 'valid 2', 'valid 3'], function(err, geocodes) {
        test.deepEqual(err, 'Received OVER_QUERY_LIMIT response status after max retries.');
        test.done();
    });
}