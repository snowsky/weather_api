var fs = require('fs');
var http = require('http');

//    ?filter[where][province][like]=ON&filter[where][position][near]="+position.lat+","+position.lng+"&filter[limit]="+numStation
function toGeoJSON(filter) {
    $.get("http://172.16.67.129:3000/api/station_list" + filter, function(data) {
        console.log(filter);
        data.forEach(function(item) {
            var geoPoint = {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [item.position[1], item.position[0]]
                },
                properties: {
                    'title': item.name,
                    'marker-color': '#ff8888',
                    'marker-symbol': 'star'
                }
            };

            var data = JSON.stringify(geoPoint);

            fs.writeFile('./config.json', data, function (err) {
                if (err) {
                  console.log('There has been an error saving your configuration data.');
                  console.log(err.message);
                  return;
                }
                console.log('Configuration saved successfully.')
            });
        });
    });
}
