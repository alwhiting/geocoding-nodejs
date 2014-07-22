// basic config
// normally not hardcoded in the source of course
var ip = '0.0.0.0';
var port = 8080;
var addressListFile = 'res/address-list.csv';

var http = require('http');
var fs = require('fs');
var AddressList = require('./AddressList');
var Geocodes = require('./Geocodes');

// init
var addressList = new AddressList(fs.readFileSync(addressListFile).toString().split("\n"));
var geocodes = new Geocodes(addressList.getAddressList());

// as part of the init we'll do all the geocoding right away
// it will prevent having to wait for the google api every time we want to view the results
// also this prevents us from hammering the google api and using up our requests for the day
// in a proper implementation this should probably be refreshed periodically or based on some event
geocodes.loadAllAddresses();

http.createServer(function(req, resp) {
    resp.writeHead(200, {'Content-Type': 'application/json'});
    resp.end(JSON.stringify(geocodes.getResults()));

}).listen(port, ip);
