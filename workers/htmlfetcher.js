var archive = require('../helpers/archive-helpers');
var http = require('http');
var fs = require('fs');

// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

exports.getHtml = function(url){
  var options = {
    host: url,
    port: 80,
    path: "/"
  };

  http.get(options, function(res) {
    console.log("Got response: " + res.statusCode);
    // We need to actually save the stuff
    var html = '';
    res.on('data', function(chunk) {
      html += chunk;
    });
    res.on('end', function() {
      fs.appendFile(paths.archivedSites + "/" + url, html);
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
};