function popupFeature(e){
    var feature = e.target.feature;
    var info = `Name: ${feature.properties.name}`;
    var popup = L.popup({
        offset: [0,10],
        closeButton:false,
        className:'hover-popup'
    }).setLatLng(e.latlng)
    .setContent(info)
    .openOn(map);
    
}

function resetHighlight(e){
    map.closePopup();
}

//Initalize Map
var map = L.map('map').setView([49.1827, -123.0207],11)


//add Base Map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// Read GeoJSON
$.getJSON("dataset/hospital.geojson", function(data){
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng){
            return L.circleMarker(latlng,{
                color: 'red',
            });
        },

        //add Interaction
        onEachFeature: function (feature, layer) {
            layer.on("mouseover", function(e) {
                popupFeature(e);
            });
            layer.on("mouseout", function(e) {
                resetHighlight(e);
            });
        }
    }).addTo(map);


    // covert GeoJSON to Turf points
    var points = data.features.map(function (feature){
        return turf.point(feature.geometry.coordinates);
    })

    //voronoi analysis
    const options = {bbox : [-123.320847,48.958581,-122.555737,49.341678]}
    var vn = turf.voronoi(turf.featureCollection(points), options)
    
    var voronoiLayer = L.layerGroup();
    //add voronoi Layer
    L.geoJSON(vn,{
        interactive: false
    }).addTo(voronoiLayer);
    voronoiLayer.addTo(map);
});

