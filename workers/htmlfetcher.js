// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.



_.each(urlArray, function (url) {
  var options = {
    host: url,
    port: 80,
    path: "/"
  };
  http.get(options, function(res) {
    console.log("Got response: " + res.statusCode);
    // We need to actually save the stuff
    

  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
  
});



/*

1 - user types in an address and hits return
      -> change to loading.html
2 - address gets saved to 'sites.txt'
3 - use downloadUrls() in conjunction with htmlfetcher.js to copy site data to proper file
4 - display site html when loading is complete

*/