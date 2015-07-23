var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var fs = require('fs');
// require more modules/folders here!


var actions = {
  'GET': function (req, res) {

    if (req.url === '/') {
      var fp = archive.paths.siteAssets + "/index.html";
    } else {
      var fp = archive.paths.archivedSites + req.url;  
    }

    fs.exists(fp, function (exists) {
      if (exists) {
        fs.readFile(fp, 'ascii', function (err, data) {
          httpHelpers.sendResponse(res, data, 200);
        });
      } else {
        httpHelpers.sendResponse(res, 'not found', 404);
      }
    });

  },
  'POST': function (req, res) {
    
    httpHelpers.collectData(req, function(data){
      var newUrl = JSON.parse(data);
      fs.appendFile(archive.paths.list, newUrl.url + '\n', function (err) {
        if (err) throw err;
        httpHelpers.sendResponse(res, "Redirected", 302);
      });
    })
  },
  'OPTIONS': function (req, res) {
    httpHelpers.sendResponse(res);
  }
};

exports.handleRequest = function (req, res) {
  var action = actions[req.method];
  if (action) {
    action(req, res);
  } else {
    httpHelpers.sendResponse(res, 'not found', 404);
  }
};