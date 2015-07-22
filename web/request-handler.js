var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var fs = require('fs');
// require more modules/folders here!


var actions = {
  'GET': function (req, res) {
    // This is specific to the first test -> fix this later to accept different routes
    console.log(" ------------> req.url: ", req.url);


    if (req.url === '/') {
      var fp = archive.paths.siteAssets + "/index.html";
    } else {
      var fp = archive.paths.archivedSites + req.url;  
    }
    
    fs.readFile(fp, 'ascii', function (err, data) {
      httpHelpers.sendResponse(res, data, 200);
    });
  },
  'POST': function (req, res) {

  },
  'OPTIONS': function (req, res) {

  }
  
  // res.end(archive.paths.list);
};


exports.handleRequest = function (req, res) {
  var action = actions[req.method];
  if (action) {
    action(req, res);
  } else {
    httpHelpers.sendResponse(res, 'not found', 404);
  }
};
