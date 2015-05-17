'use strict'

var request = require('request');
var cheerio = require('cheerio');
var fs = require('graceful-fs'),
    http = require('http'),
    async = require('async'),
    sync = require('synchronize'),
    path = require('path');
var onFinished = require('on-finished');
var destroy = require('destroy');
var httpSync = require('http-sync');
var depth = 0;
var maxfiles = 200;
//var url = 'http://dd.weather.gc.ca/';
var url = 'http://dd.weather.gc.ca/hydrometric/csv/ON/daily/';
sync(http, 'get');

function parseUrl (url, callback) {
  callback(url);
}

var mkdirSync = function (path) {
  try {
    fs.mkdirSync(path);
  } catch(e) {
    if ( e.code != 'EEXIST' ) throw e;
  }
}

function onLoaded(u, d) {
  if(d == '') {
    return;
  }
//  d.forEach(function (k, v) {
    //console.log(u.replace(url, ''));
    console.log("onLoaded: "+u+d);
//    mkdirSync((u+d).replace(url, ''));
//    dataLoader(u+k.href, onLoaded);
    //fs.rmdir(k.href);
    //fs.unlinkSync(k.href); unable to work
//  });
}

function dataLoader(u) {
  request(u, function (err, resp, body) {
    if (body) {
      var $ = cheerio.load(body);
      $('a').each(function (k, v) {
        var title = $(this).text();
        var href = $(this).attr('href');
        if (href[href.length-1] == '/' && title != 'Parent Directory') {
          mkdirSync((u+href).replace(url, ''));
          dataLoader(u+href);
        }
        if (href.indexOf('.csv') > -1) {
          console.log("before get "+(u+href).replace(url, ''));
      /*    var req = httpSync.request({
            method: 'GET',
            headers: {},
            body: '',
            protocol: 'http',
            host: '205.189.10.47',
            path: "(u+href).replace(url, '')"
          });

          var response = req.end();
  */
  //        var i = 1, threads = 5;
  //        require('async').eachLimit(photourl, threads, function(url, next){
          var req = http.get(u+href, function (res) {
            console.log("before data "+u+href);
            var data = '';
            res.on('data', function(chunk){
              data += chunk;
            });
            console.log("before end "+u+href);
            res.on('end', function () {
              var file = fs.writeFileSync((u+href).replace(url, ''), data);
              console.log("end "+u+href);
            });
          }).on('error', function(e) {
            console.log("Got error: " + e.message);
            process.exit(100);
          });
        }

  //}, function(){
  //   console.log('finished');
  //})
          //var file = fs.createWriteStream((u+href).replace(url, ''));
  /*        var file = fs.writeFileSync((u+href).replace(url, ''));
          var request = http.get(u+href, function(response) {
    	  response.pipe(file);
            onFinished(response, function (err, response) {
            //  if (onFinished.isFinished(response)) {
                destroy(request);
                destroy(response);
                destroy(file);
  	  //  }
            });
  	  //file.on('end', function (err) { file.end(); });
          });*/
      });
    } else {
        // do something else
    }
//    return done(u, dir);
  });
}

//dataLoader(url, onLoaded);
dataLoader(url);
