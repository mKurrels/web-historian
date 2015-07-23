var fs = require('fs');
var path = require('path');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)

  fs.exists(asset, function (exists) {
    if (exists) {
      fs.readFile(asset, 'ascii', function (err, data) {
        callback(res, data, 200);
      });
    } else {
      callback(res, "Not Found", 404);
    }
  });
};

exports.sendResponse = function(response, data, statusCode){
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(data);
};

exports.collectData = function(request, callback){
  var data = "";
  request.on('data', function(chunk){
    data += chunk;
  });
  request.on('end', function(){
    callback(data);
  });
};