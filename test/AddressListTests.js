/*
 * nodeunit unit tests for AddressList
 */

var AddressList = require('../src/AddressList.js');

// a subset of the given input and some extra junk that could be problematic
var testAddresses = [
    'Address',
    '"3895 Church Street, Clarkston, GA 30021, USA"',
    '"7665 Honey Abbey, Koggiung, MA"',
    '"9974 Round Bluff Villas, Hemp, NH"',
    '"1103 Bombay Lane, Roswell, GA 30076, USA"',
    '"8462 Lazy Walk, Lumpkin, VA"',
    '"4716 Cinder Cider Green, Bowbells, NH"',
    '"7206 Hidden Alley, Badnation, HI"',
    '"2991 Middle Branch Corner, Baltimore, MS"',
    '"4501 Harvest Lagoon Trail, Screamer, VT"',
    '6375 Spalding Drive Suite B Norcross',
    '"4675 Highway 27 North, Carrollton, GA"',
    '5370 Ash Street',
    '"1978 Mount Vernon Road, Atlanta, GA 30338, USA"',
    '"4827 Indian Wharf, Dew Drop, NH, 03637-1315"',
    '"9418 Lost Stead, Sioux Lookout, ME"',
    '"3185 Rocky Valley, Bumble Bee, ND"',
    '"180 Foggy Lane, Line Store, MS"',
    '"4535 Silent Freeway, Bamboo, KY"',
    '"6109 Bright Loop, Gaysport, WV"',
    '         123 excess white space street      ',
    ' -982.452 also discarded '
];

var expectedAddresses = [
    '3895 Church Street, Clarkston, GA 30021, USA',
    '7665 Honey Abbey, Koggiung, MA',
    '9974 Round Bluff Villas, Hemp, NH',
    '1103 Bombay Lane, Roswell, GA 30076, USA',
    '8462 Lazy Walk, Lumpkin, VA',
    '4716 Cinder Cider Green, Bowbells, NH',
    '7206 Hidden Alley, Badnation, HI',
    '2991 Middle Branch Corner, Baltimore, MS',
    '4501 Harvest Lagoon Trail, Screamer, VT',
    '6375 Spalding Drive Suite B Norcross',
    '4675 Highway 27 North, Carrollton, GA',
    '5370 Ash Street',
    '1978 Mount Vernon Road, Atlanta, GA 30338, USA',
    '4827 Indian Wharf, Dew Drop, NH, 03637-1315',
    '9418 Lost Stead, Sioux Lookout, ME',
    '3185 Rocky Valley, Bumble Bee, ND',
    '180 Foggy Lane, Line Store, MS',
    '4535 Silent Freeway, Bamboo, KY',
    '6109 Bright Loop, Gaysport, WV',
    '123 excess white space street'
];

exports.testLoadValidAddresses = function(test) {
    var addressList = new AddressList(testAddresses);
    var parsedAddressList = addressList.getAddressList();

    test.equal(parsedAddressList.length, expectedAddresses.length);
    test.deepEqual(parsedAddressList, expectedAddresses);
    test.done();
}

exports.testLoadJunkValues = function(test) {
    var addressList = new AddressList(null);
    test.deepEqual(addressList.getAddressList(), []);

    addressList = new AddressList(undefined);
    test.deepEqual(addressList.getAddressList(), []);

    addressList = new AddressList();
    test.deepEqual(addressList.getAddressList(), []);

    addressList = new AddressList('4827 Indian Wharf, Dew Drop, NH, 03637-1315');
    test.deepEqual(addressList.getAddressList(), []);

    addressList = new AddressList({});
    test.deepEqual(addressList.getAddressList(), []);

    test.done();
}