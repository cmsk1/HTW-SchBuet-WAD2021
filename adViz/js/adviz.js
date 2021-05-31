let users = {};
let contacts = {};

function initAdviz() {
    createMap();

    addLoginUser({
        username: 'admina',
        password: '1234',
        isAdmin: true
    });

    addLoginUser({
        username: 'normalo',
        password: 'abc',
        isAdmin: false
    });

    addContact({
        firstName: 'Andre',
        lastName: 'Domstet',
        lat: 52.45964364393213,
        lon: 13.52383912594944,
        isPublic: true,
        owner: 'normalo'
    });

    addContact({
        firstName: 'Michael',
        lastName: 'Müller',
        lat: 52.5059093309401,
        lon: 13.356209023673221,
        isPublic: false,
        owner: 'normalo'
    });

    addContact({
        firstName: 'Max',
        lastName: 'Mustermann',
        lat: 52.563209103963535,
        lon: 13.359976549887557,
        isPublic: false,
        owner: 'admina'
    });

    addContact({
        firstName: 'Jane',
        lastName: 'Doe',
        lat: 53.515454041624906,
        lon: 10.020539336041693,
        isPublic: true,
        owner: 'admina'
    });
}

function handleLogin(event) {
    try {
        let username = event.target.username.value;
        let password = event.target.pwd.value;
        let user = users[username];

        if (user != null && user.password === password) {
            setLoggedUser(user);
        } else {
            throw new Error('invalid login');
        }
    } catch (err) {
        alert('Die Anmeldung ist fehlgeschlagen!');
    }
    return false;
}

function handleAdd(event) {
    try {
        let firstName = event.target.firstName.value;
        let lastName = event.target.lastName.value;
        let street = event.target.street.value;
        let zip = event.target.zip.value;
        let city = event.target.city.value;
        let state = event.target.state.value;
        let country = event.target.country.value;
        let privat = event.target.privat.checked;
        let owner = event.target.owner.value;
        console.log(firstName, lastName, street, zip, city, state, country, privat, owner);
    } catch (err) {
        alert('Der Kontakt konnte nicht hinzugefügt werden');
    }
    return false;
}

function setLoggedUser(user) {
    let loginEl = document.getElementById('login');
    let loggedEls = document.getElementsByClassName('logged');
    let loginStyle = (user != null) ? 'none' : '';
    let loggedStyle = (user == null) ? 'none' : '';
    loginEl.style.display = loginStyle;

    for (let i = 0; i < loggedEls.length; i++) {
        loggedEls.item(i).style.display = loggedStyle;
    }
    contacts = listContacts(user);
    updateContactList();
    map.updateSize();
}

function updateContactList() {
    let namesEl = document.getElementById('name-list');
    namesEl.innerHTML = '';
    markers.clear();

    for (let contactId in contacts) {
        let contact = contacts[contactId];
        namesEl.innerHTML += `<li>${contact.firstName} ${contact.lastName}</li>`;
        let pos = latlon(contact.lat, contact.lon);

        let marker = new ol.Feature({
            geometry: new ol.geom.Point(pos),
            contactPos: pos
        });
        markers.addFeature(marker);
    }
}

function addLoginUser(desc) {
    let user = deepCopy(desc);
    users[user.username] = user;
}

function openPopup(edit) {
    if (!edit) {
        document.getElementById('popup-header-text').innerText = 'Add Contact';
        document.getElementById('btn-update-contact').style.display = 'none';
        document.getElementById('btn-add-contact').style.display = 'inline-block';
    } else {
        document.getElementById('popup-header-text').innerText = 'Update Contact';
        document.getElementById('btn-update-contact').style.display = 'inline-block';
        document.getElementById('btn-add-contact').style.display = 'none';
    }
    let popupDiv = document.getElementById('add-contact');
    popupDiv.style.display = "block";
}

function closePopup() {
    let popupDiv = document.getElementById('add-contact');
    popupDiv.style.display = "none";
}
