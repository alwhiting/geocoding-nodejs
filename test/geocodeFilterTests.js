var geocodeFilter = require('../src/GeocodeFilter');

exports.testOKGeocode = function(test) {
    // pass in a dummy object that has all the things we're looking for
    // basically just that it is ROOFTOP, results.length == 1 and partial_result: true is absent
    test.equal(geocodeFilter.validateGeocode({results:[{geometry: {location_type: 'ROOFTOP'}}]}), true);
    test.done();
}

exports.testFailNotRooftop = function(test) {
    test.equal(geocodeFilter.validateGeocode({results:[{geometry: {location_type: 'NOT_ROOFTOP'}}]}), false);
    test.done();
}

exports.testFailMultipleResults = function(test) {
    test.equal(geocodeFilter.validateGeocode({results:[{geometry: {location_type: 'ROOFTOP'}}, {geometry: {location_type: 'ROOFTOP'}}]}), false);
    test.done();
}

exports.testFailPartialResult = function(test) {
    test.equal(geocodeFilter.validateGeocode({results:[{partial_match: true, geometry: {location_type: 'ROOFTOP'}}]}), false);
    test.done();
}

exports.testFailRandomInput = function(test) {
    test.equal(geocodeFilter.validateGeocode(null), false);
    test.equal(geocodeFilter.validateGeocode({}), false);
    test.equal(geocodeFilter.validateGeocode(undefined), false);
    test.equal(geocodeFilter.validateGeocode({results:null}), false);
    test.equal(geocodeFilter.validateGeocode({results:undefined}), false);
    test.done();
}