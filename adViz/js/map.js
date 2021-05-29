let map;
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
        center: latlon(52.519970187378384, 13.40615345902602),
        zoom: 12,
        minZoom: 4
    });
    
    map = new ol.Map({
        target: 'map',
        layers: [ tileLayer, markerLayer ],
        view
    });

    map.on('click', (event) => {
        let features = map.getFeaturesAtPixel(event.pixel);
        let feature = features.slice(0, 1)[0];
        if (feature == null) return;
        let pos = feature.get('contactPos');
        
        view.animate({
            zoom: 16,
            center: pos,
            easing: ol.easing.easeOut,
            duration: 2000
        });
    });
}

function latlon(lat, lon) {
    return ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857');
}

function lookupLatLon(address) {
    return new Promise((resolve, reject) => {
        let query = `${address.street}`;
        let request = new XMLHttpRequest();

        request.onload = () => {
            try {
                let data = JSON.parse(request.responseText);

                if (data.length !== 1) {
                    throw new Error('address is ambiguous');
                }
                let entry = data[0];
                let lat = parseFloat(entry.lat);
                let lon = parseFloat(entry.lon);
                resolve({ lat, lon });
            } catch (err) {
                reject(err);
            }
        };
        request.onerror = reject;
        request.open('GET', `https://nominatim.openstreetmap.org/search?q=${query}&format=json&polygon=1&addressdetails=1`, true);
        request.send();    
    });
}
