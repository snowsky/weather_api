"use strict";

var fs = require('fs');
var csv = require('fast-csv');
var http = require('http');

var api_url = "http://172.16.67.129:3000/api/station_list";

function toGeoJSON() {
    var optionsget = {
        host : '172.16.67.129',
        port : 3000,
        path : '/api/station_list'
    };
    var reqGet = http.get(optionsget, function(res) {
//        console.log('STATUS: ' + res.statusCode);
//        console.log('HEADERS: ' + JSON.stringify(res.headers));

        // Buffer the body entirely for processing as a whole.
        var stations = '';
        res.on('data', function(d) {
            stations += d;
        }).on('end', function() {
            var geoJson = [];
            var jStation = JSON.parse(stations);
//            fs.writeFile('./config.json', JSON.stringify(jStation), function (err) {
//                if (err) {
//                  console.log('There has been an error saving your configuration data.');
//                  console.log(err.message);
//                  return;
//                }
////                console.log('Configuration saved successfully.')
//            });

            
            jStation.forEach(function(item) {
                console.log(item);
            // You can process streamed parts here...
                var geoPoint = {
                    type: 'Feature',
                    geometry: {
                        type: 'MultiPoint',
                        coordinates: [item.position[1], item.position[0]]
                    },
                    properties: {
                        'title': item.name,
                        'marker-color': '#ff8888',
                        'marker-symbol': 'star'
                    }
                };
                geoJson.push(geoPoint);
                
            });
            
            var data = JSON.stringify(geoJson);
                
            fs.writeFile('./config.json', data, function (err) {
                if (err) {
                  console.log('There has been an error saving your configuration data.');
                  console.log(err.message);
                  return;
                }
                console.log('Configuration saved successfully.')
            });

//                var body = Buffer.concat(stations);
//                console.log('BODY: ' + stations);
            // ...and/or process the entire body here.
        });
        
    });
}
toGeoJSON();

//// This section is for retrieving data via API
//var stream = fs.createReadStream("hydrometric_StationList.csv");
//
//var csvStream = csv()
//    .on("data", function(data){
//        if (data[0].length == 7) {
//            var station = {
//                "stationid": data[0],
//                "name": data[1],
//                "position": [
//                    data[2],data[3]
//                ],
//                "province": data[4],
//                "timezone": data[5]
//            };
//            var jsonObject = JSON.stringify(station);
//            console.log(jsonObject);
//            
//            // prepare the header
//            var postheaders = {
//                'Content-Type' : 'application/json',
//                'Content-Length' : Buffer.byteLength(jsonObject, 'utf8')
//            };
//            
//            // the post options
//            var optionspost = {
//                host : 'localhost',
//                port : 3000,
//                path : '/api/station_list',
//                method : 'POST',
//                headers : postheaders
//            };
//            
//            var reqPost = http.request(optionspost, function(res) {
//                console.log("statusCode: ", res.statusCode);
//                // uncomment it for header details
//            //  console.log("headers: ", res.headers);
//
//                res.on('data', function(d) {
//                    console.info('POST result:\n');
//                    process.stdout.write(d);
//                    console.info('\n\nPOST completed');
//                });
//            });
//            
//            // write the json data
//            reqPost.write(jsonObject);
//            reqPost.end();
//            reqPost.on('error', function(e) {
//                console.error(e);
//            });
//        }
//    })
//    .on("end", function(){
//         console.log("done");
//    });
// 
//stream.pipe(csvStream);
