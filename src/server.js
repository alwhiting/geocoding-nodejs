// basic config
// normally not hardcoded
var ip = '0.0.0.0';
var port = 8080;
var addressListFile = 'res/address-list.csv';

var http = require('http');
var fs = require('fs');
var AddressList = require('./AddressList');
var geocodeAddresses = require('./geocodeAddresses');

var geocodes = [];
var errMsg = null;

// init
var addressList = new AddressList(fs.readFileSync(addressListFile).toString().split("\n"));

// As part of the init we'll do all the geocoding right away;
// it will prevent having to wait for the google api every time we want to get the results
// also this prevents us from hammering the google api and using up our requests for the day.
// In a proper implementation this should probably be refreshed based on some event or time.
var finishedCallback = function(err, geocodeResults) {
    if (err) {
        errMsg = err.toString();
        console.log(errMsg);
    } else {
        geocodes = geocodeResults;
        console.log('Finished geocoding addresses; ' + geocodes.length + ' geocodes retained.');
    }
}
geocodeAddresses.geocode(addressList.getAddressList(), finishedCallback);

// super simple server
http.createServer(function(req, resp) {
    if (errMsg == null && geocodes.length == 0) {
        resp.writeHead(503, {'Content-Type': 'application/json'});
        resp.end(JSON.stringify({error: 'Addresses still being geocoded, please try again.'}));

    } else if (errMsg) {
        resp.writeHead(500, {'Content-Type': 'application/json'});
        resp.end(JSON.stringify({error: errMsg}));

    } else {
        resp.writeHead(200, {'Content-Type': 'application/json'});
        resp.end(JSON.stringify(geocodes));
    }

}).listen(port, ip);
