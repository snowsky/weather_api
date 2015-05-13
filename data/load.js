"use strict";

var fs = require('fs');
var csv = require('fast-csv');
var http = require('http');

var api_url = "http://localhost:3000/api/station_list";

var stream = fs.createReadStream("hydrometric_StationList.csv");
 
var csvStream = csv()
    .on("data", function(data){
        if (data[0].length == 7) {
            var station = {
                "stationid": data[0],
                "name": data[1],
                "position": [
                    data[2],data[3]
                ],
                "province": data[4],
                "timezone": data[5]
            };
            var jsonObject = JSON.stringify(station);
            console.log(jsonObject);
            
            // prepare the header
            var postheaders = {
                'Content-Type' : 'application/json',
                'Content-Length' : Buffer.byteLength(jsonObject, 'utf8')
            };
            
            // the post options
            var optionspost = {
                host : 'localhost',
                port : 3000,
                path : '/api/station_list',
                method : 'POST',
                headers : postheaders
            };
            
            var reqPost = http.request(optionspost, function(res) {
                console.log("statusCode: ", res.statusCode);
                // uncomment it for header details
            //  console.log("headers: ", res.headers);

                res.on('data', function(d) {
                    console.info('POST result:\n');
                    process.stdout.write(d);
                    console.info('\n\nPOST completed');
                });
            });
            
            // write the json data
            reqPost.write(jsonObject);
            reqPost.end();
            reqPost.on('error', function(e) {
                console.error(e);
            });
        }
    })
    .on("end", function(){
         console.log("done");
    });
 
stream.pipe(csvStream);
