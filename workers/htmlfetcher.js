var fs = require('fs');
var http = require('http');
var _ = require('underscore');
var archive = require('../helpers/archive-helpers');

// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

console.log('Running htmlfetcher.js using crontab...');

console.log('Getting list of URLs...');
archive.readListOfUrls(function(siteArray){
  downloadUrls(siteArray);
});

var downloadUrls = function(urlArray){
  _.each(urlArray, function (url) {
    console.log('downloading:', url);
    if (url.length > 0) {
      getHtml(url);
    }
  });
};

exports.getHtml = getHtml = function(url){
  var options = {
    host: url,
    port: 80,
    path: "/"
  };

  http.get(options, function(res) {
    console.log("Got response: " + res.statusCode);
    
    var html = '';
    res.on('data', function(chunk) {
      html += chunk;
    });
    
    res.on('end', function() {
      var fp = archive.paths.archivedSites + "/" + url;
      fs.exists(fp, function(exists){
        if (exists) {
          fs.writeFile(fp, html, function (err){
            if (err) throw err;
            console.log('Overwrote:', url);
          });
        } else {
          fs.appendFile(fp, html, function (err){
            if (err) throw err;
            console.log('Created:', url);
          });
        }
      })
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
};

console.log('Done!');