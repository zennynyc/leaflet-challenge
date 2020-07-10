var url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var API_KEY = "pk.eyJ1IjoidmluaHAzMyIsImEiOiJja2NlOWRvZjQwMTdhMzRxZnFleHZxOWMxIn0.UgtcYJcKG1GPcGwy9QUIZQ";

// Defining the function  
function markerSize(magnitude) {
    return magnitude * 10;
};
function chooseColor(magnitude) {
  if (magnitude > 5) {
       return "fuchsia";
   } else if (magnitude > 4) {
       return "aqua"
   } else if (magnitude > 3) {
       return "purple";
   } else if (magnitude > 2) {
       return "yellow";
   } else if (magnitude > 1) {
       return "teal";
   } else {
       return "lime"
   }
 };

d3.json(url, function(data) {
    var earthquake_data = data;
    createFeatures(earthquake_data);
  });


 
function createFeatures(earthquakeData) {
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
      return new L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        fillOpacity: 1,
        color: chooseColor(feature.properties.mag),
        fillColor: chooseColor(feature.properties.mag),
        radius: markerSize(feature.properties.mag*2000)
      });
    }
// Create a GeoJSON layer containing the features array on the earthquakeData object
// Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: onEachFeature
    });

  // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
};

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v9",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
  Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var my_Map = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  //Add Legend

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
    var div = L.DomUtil.create('div', 'info legend'),
        magnitudes = [0, 1, 2, 3, 4, 5],
        
        labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];

        for (var i = 0; i < magnitudes.length; i++) {
          div.innerHTML +=
              '<i style="background:' + chooseColor(magnitudes[i] + 1) + '"></i> ' + 
      + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : ' + ');
      }
  
      return div;
  };
  
  legend.addTo(my_Map);
 
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
    }).addTo(my_Map);
}
