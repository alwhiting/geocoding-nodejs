var geocoder = require('geocoder');
var geocodeFilter = require('./geocodeFilter');

var addresses = [];
var maxRetries = 3;

exports.geocodeAddresses = function(addressesArray, finishedCallback) {
    addresses = addressesArray;
    processAddress(addresses.shift(), finishedCallback, []);

}

function processAddress(address, finishedCallback, geocodes, retries) {
    if (!address) {
        finishedCallback(geocodes);
        return;
    }

    geocoder.geocode(address, function (err, res) {
        // abort on any error
        if (err) {
            throw new Exception(err);
        }

        // abort on any unexpected status
        if (res.status != 'ZERO_RESULTS' && res.status != 'OVER_QUERY_LIMIT' && res.status != 'OK') {
            throw new Exception('Unexpected status ' + res.status + ' from geocoding API.');
        }

        // api didn't find anything
        if (res.status == 'ZERO_RESULTS') {
            console.log('No results for "%s".', address);
            processAddress(addresses.shift(), finishedCallback, geocodes);

        // hit the api query limit, wait 2 seconds up to 3 times
        } else if (res.status == 'OVER_QUERY_LIMIT') {
            if (!retries || retries < maxRetries) {
                console.log('Hit API rate limit, delaying 2 seconds.');
                setTimeout(processAddress, 2000, address, finishedCallback, geocodes, (retries ? retries + 1 : 1));

            } else {
                throw new Exception('Received OVER_QUERY_LIMIT response status after max retries.');
            }

        // OK status
        } else {
            if (geocodeFilter.validateGeocode(res)) {
                geocodes.push(res);
            }
            processAddress(addresses.shift(), finishedCallback, geocodes);
        }
    });
}