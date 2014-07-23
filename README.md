geocoding-nodejs
================

- built using nodejs v0.10.29

The implementation is fairly straightforward so not much to say about it here.
In some source files I've included some small comments to explain my thinking.
I've left some log output to console in here that wouldn't normally go in a
production bit of code but as this is a test I thought it might be good to see
some events happening.

Sources in src/ directory; unit tests in the test/ directory. Unit tests use
'nodeunit'.

To run main app, from root project directory:
node src/server.js

To run tests, from root project directory:
nodeunit test/<testfile>


Note;
You may need to use npm to install 'geocoder': npm install geocoder
