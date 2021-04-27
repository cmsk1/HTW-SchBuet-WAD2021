const markers = new ol.source.Vector();

function createMap() {
    let tiles = new ol.source.OSM();
    let tileLayer = new ol.layer.Tile({ source: tiles });

    let markerStyle = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            scale: 0.1,
            src: 'images/marker.png'
        })
    });

    let markerLayer = new ol.layer.Vector({
        source: markers,
        style: markerStyle
    });

    let view = new ol.View({
        center: latlon(51.96164979074686, 10.218169661995162),
        zoom: 6,
        minZoom: 4
    });
    
    let map = new ol.Map({
        target: 'map',
        layers: [ tileLayer, markerLayer ],
        view
    });

    map.on('click', (event) => {
        let features = map.getFeaturesAtPixel(event.pixel);
        let feature = features.slice(0, 1)[0];
        if (feature == null) return;
        let user = users.get(feature.get('userId'));
        if (user == null) return;
        
        view.animate({
            zoom: 16,
            center: latlon(user.lat, user.lon),
            easing: ol.easing.easeOut,
            duration: 2000
        });
    });
}

function latlon(lat, lon) {
    return ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857');
}

function updateMapMarkers() {
    markers.clear();

    for (let user of users.values()) {
        let pos = latlon(user.lat, user.lon);

        let marker = new ol.Feature({
            geometry: new ol.geom.Point(pos),
            userId: user.userId
        });
        markers.addFeature(marker);
    }
}
