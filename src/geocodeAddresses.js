/*
 * Processes addresses into geocodes.
 * Processes the addresses in a serial manner due to the need
 * to delay subsequent calls to the API due to its rate limiting.
 */
var geocoder = require('geocoder');
var geocodeFilter = require('./geocodeFilter');

var addresses = [];
var maxRetries = 3;

// processes all addresses and calls finishedCallback(err, geocodes)
exports.geocode = function(addressesArray, finishedCallback) {
    addresses = addressesArray;
    processAddress(addresses.shift(), finishedCallback, [], 0);

}

function processAddress(address, finishedCallback, geocodes, retries) {
    if (!address) {
        finishedCallback(null, geocodes);
        return;
    }

    geocoder.geocode(address, function (err, res) {
        // abort on any error
        if (err) {
            finishedCallback(err);
            return;
        }

        // abort on any unexpected status
        if (res.status != 'ZERO_RESULTS' && res.status != 'OVER_QUERY_LIMIT' && res.status != 'OK') {
            finishedCallback('Unexpected status ' + res.status + ' from geocoding API.');
            return;
        }

        // api didn't find anything
        if (res.status == 'ZERO_RESULTS') {
            console.log('No results for "%s".', address);
            processAddress(addresses.shift(), finishedCallback, geocodes, 0);

        // hit the api query limit, wait 2 seconds up to 3 times
        } else if (res.status == 'OVER_QUERY_LIMIT') {
            if (retries < maxRetries) {
                console.log('Hit API rate limit, delaying 2 seconds; retry: ' + (retries + 1));
                setTimeout(processAddress, 2000, address, finishedCallback, geocodes, retries + 1);

            } else {
                finishedCallback('Received OVER_QUERY_LIMIT response status after max retries.');
            }

        // OK status
        } else {
            if (geocodeFilter.validateGeocode(res)) {
                geocodes.push(res);
            }
            processAddress(addresses.shift(), finishedCallback, geocodes, 0);
        }
    });
}