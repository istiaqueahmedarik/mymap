mapboxgl.accessToken =
"pk.eyJ1IjoiaXN0aWFxdWVhaG1lZCIsImEiOiJja2toc2VlMTMwMHZ4MndtejJzMG45NnR6In0.HiAGCwk8k6T5dGUtvb2KyA";
navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
    enableHighAccuracy:true
})
function successLocation(position) {
    console.log(position)
    setupMap([ position.coords.longitude,position.coords.latitude])
}
function errorLocation(position) {
    console.log(position)
    setupMap([ -2.24,53.48])
}
function setupMap(center) {
    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: center,
        zoom:15,
        pitch: 45,
        bearing: -17.6,
        container: 'map',
        antialias: true, 
        
        });
        
    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav);
    var directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        
      });
      map.on('load', function () {
       
        // Insert the layer beneath any symbol layer.
        var layers = map.getStyle().layers;
         
        var labelLayerId;
        for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
        labelLayerId = layers[i].id;
        break;
        }
        }
         
        map.addLayer(
        {
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
        'fill-extrusion-color': '#aaa',
         
        // use an 'interpolate' expression to add a smooth transition effect to the
        // buildings as the user zooms in
        'fill-extrusion-height': [
        'interpolate',
        ['linear'],
        ['zoom'],
        15,
        0,
        15.05,
        ['get', 'height']
        ],
        'fill-extrusion-base': [
        'interpolate',
        ['linear'],
        ['zoom'],
        15,
        0,
        15.05,
        ['get', 'min_height']
        ],
        'fill-extrusion-opacity': 0.6
        }
        },
        labelLayerId
        );
        });
        var layerList = document.getElementById('menu');
        console.log(layerList)
        var inputs = layerList.getElementsByTagName('input');
         
        function switchLayer(layer) {
        var layerId = layer.target.id;
        map.setStyle('mapbox://styles/mapbox/' + layerId);
        }
         
        for (var i = 0; i < inputs.length; i++) {
        inputs[i].onclick = switchLayer;
        }
        map.addControl(directions, 'top-right');
        var geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            flyTo: {
            bearing: 0,
            // These options control the flight curve, making it move
            // slowly and zoom out almost completely before starting
            // to pan.
            speed: 0.5, // make the flying slow
            curve: 1, // change the speed at which it zooms out
            // This can be any easing function: it takes a number between
            // 0 and 1 and returns another number between 0 and 1.
            easing: function (t) {
            return t;
            }
            },
            mapboxgl: mapboxgl
            });
            map.addControl(geocoder);
            
            
            
}
