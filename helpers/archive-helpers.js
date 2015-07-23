var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http')
var htmlFetcher = require('../workers/htmlfetcher')

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = readListOfUrls = function(callback){
  var results = [];
  fs.readFile(paths.list, 'utf-8', function (err, data) {
    results = data.split('\n');
    callback(results);
  });
};

exports.isUrlInList = function(url, callback){
  readListOfUrls(function(siteArray) {
    callback(_.contains(siteArray, url));
  });
};

exports.addUrlToList = function(url){
  fs.appendFile(paths.list, url + '\n', function (err) {
    if (err) throw err;
  });
};

exports.isUrlArchived = function(url, callback){
  fs.exists(url, function (exists) {
    callback(exists);
  });
};

exports.downloadUrls = function(urlArray){
  _.each(urlArray, function (url) {
    htmlFetcher.getHtml(url);
  });
};