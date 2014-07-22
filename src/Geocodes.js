/*
 * This class is responsible for obtaining geocode info from the given array of addresses
 */

var EventEmitter = require('events').EventEmitter;
var geocoder = require('geocoder');
var geocodeResults = [];

function Geocodes(addressArray, geocoderProvider) {
    this.addressArray = addressArray;
    this.emitter = new EventEmitter();

    // allows mocking
    if (geocoderProvider) {
        geocoder.providerObj = geocoderProvider;
    }
}

Geocodes.prototype.loadAllAddresses = function() {
    geocodeResults = [];
    this.emitter.once('geocode.all.addresses.loaded', function() {
        console.log("All addresses have been geocoded. Loaded: %d addresses successfully.", geocodeResults.length);
    });
    loadAddressAndChain(this, 0);
}

Geocodes.prototype.getResults = function() {
    return geocodeResults;
}

function loadAddressAndChain(geocodes, addressIndex) {
    geocoder.geocode(geocodes.addressArray[addressIndex], function(err, res) {
        if (err) {
            console.log("Received error response %s at index: %d, stopping.", err, addressIndex);
            geocodes.emitter.emit('geocode.addresses.loaded.with.err', addressIndex);
            return;
        }

        if (res.status == 'ZERO_RESULTS') {
            console.log("Note address at index %d(%s) returned no results.", addressIndex, geocodes.addressArray[addressIndex]);
            chain(geocodes, addressIndex);

        } else if (res.status == 'OVER_QUERY_LIMIT') {
            console.log("Hit API rate limit, delaying 2 seconds.");
            setTimeout(loadAddressAndChain, 2000, geocodes, addressIndex);
            return;

        } else if (res.status == 'OK') {
            geocodeResults.push(res);
            chain(geocodes, addressIndex);

        } else {
            console.log("Received non-OK response %s at index: %d, stopping.", res.status, addressIndex);
            geocodes.emitter.emit('geocode.addresses.loaded.with.err', addressIndex);
            return;
        }
    });
}

function chain(geocodes, addressIndex) {
    if (addressIndex + 1 < geocodes.addressArray.length) {
        loadAddressAndChain(geocodes, addressIndex + 1);
    } else {
        geocodes.emitter.emit('geocode.all.addresses.loaded');
    }
}

module.exports = Geocodes;