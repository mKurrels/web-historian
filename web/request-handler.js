var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var fs = require('fs');
var htmlFetcher = require('../workers/htmlfetcher')

// require more modules/folders here!


var actions = {
  'GET': function (req, res) {
    if (req.url === '/') {
      var fp = archive.paths.siteAssets + "/index.html";
    } 
    else if (req.url === "/styles.css") {
      var fp = archive.paths.siteAssets + "/styles.css";
    }
    else if (req.url === "/loading.html") {
      var fp = archive.paths.siteAssets + "/loading.html";
    }
    else {
      var fp = archive.paths.archivedSites + req.url;  
    }
    httpHelpers.serveAssets(res, fp, function(res, fileData, statusCode){
      httpHelpers.sendResponse(res, fileData, statusCode);
    });
  },
  'POST': function (req, res) {
    httpHelpers.collectData(req, function(data){
      var newUrl = data.slice(4);
      var newFile = archive.paths.archivedSites + "/" + newUrl;

      archive.isUrlArchived(newFile, function(exists){
        console.log('url:', newFile);
        console.log('exists:', exists);

        if (exists) {
          console.log('Loading:', newFile);
          httpHelpers.serveAssets(res, newFile, function(res, fileData, statusCode){
            httpHelpers.sendResponse(res, fileData, 302);
          });
        } 
        else {
          // Redirect user to loading screen
          var fp = archive.paths.siteAssets + "/loading.html";
          httpHelpers.serveAssets(res, fp, function(res, fileData, statusCode){
            httpHelpers.sendResponse(res, fileData, 302);
          });
          // Add url to list
          console.log("adding", newUrl, "to sites.txt.");
          archive.addUrlToList(newUrl);

          console.log("downloading", newUrl);
          htmlFetcher.getHtml(newUrl);
        }
      });
    });  
  },
  'OPTIONS': function (req, res) {
    httpHelpers.sendResponse(res);
  }
};

exports.handleRequest = function (req, res) {
  console.log(' --[', req.method, ']--> ', req.url);
  var action = actions[req.method];
  if (action) {
    action(req, res);
  } else {
    httpHelpers.sendResponse(res, 'not found', 404);
  }
};