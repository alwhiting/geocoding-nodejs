/*
 * Applies our filter requirements to geocodes.
 */

exports.validateGeocode = function(geocode) {
    return geocode instanceof Object
        && geocode.results instanceof Array
        && geocode.results.length == 1
        && geocode.results[0].geometry.location_type == 'ROOFTOP'
        && !geocode.results[0].partial_match;
}
