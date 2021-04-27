const users = new Map();

function initAdviz() {
    createMap();
    
    addPseudoUser({
        firstName: 'Andre',
        lastName: 'Domstet',
        lat: 52.45964364393213,
        lon: 13.52383912594944,
        isPublic: true
    });

    addPseudoUser({
        firstName: 'Michael',
        lastName: 'Müller',
        lat: 52.5059093309401,
        lon: 13.356209023673221,
        isPublic: false
    });

    addPseudoUser({
        firstName: 'Max',
        lastName: 'Mustermann',
        lat: 52.39748500230898,
        lon: 13.051048860558936,
        isPublic: false
    });

    addPseudoUser({
        firstName: 'Jane',
        lastName: 'Doe',
        lat: 53.515454041624906,
        lon: 10.020539336041693,
        isPublic: true
    });

    updateMapMarkers();
}

function addPseudoUser(userDesc) {
    let userId = '';

    for (let i = 0; i < 16; i++) {
        let r = Math.floor(Math.random() * 16);
        userId += r.toString(16);
    }
    userDesc.userId = userId;
    users.set(userId, userDesc);
    return userId;
}
