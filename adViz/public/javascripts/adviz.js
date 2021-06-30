let users = {};
let loggedUser = null;


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
        street: 'Wilhelminenhofstraße 47B',
        city: 'Berlin',
        state: 'Berlin',
        country: 'Germany',
        zip: '12459',
        lat: 52.45964364393213,
        lon: 13.52383912594944,
        isPrivate: true,
        owner: 'normalo'
    });

    addContact({
        firstName: 'Michael',
        lastName: 'Müller',
        street: 'Lützowstraße 51H',
        city: 'Berlin',
        state: 'Berlin',
        country: 'Germany',
        zip: '10785',
        lat: 52.5059093309401,
        lon: 13.356209023673221,
        isPrivate: false,
        owner: 'normalo'
    });

    addContact({
        firstName: 'Max',
        lastName: 'Mustermann',
        street: 'Brienzer Straße 56',
        city: 'Berlin',
        state: 'Berlin',
        country: 'Germany',
        zip: '13407',
        lat: 52.563209103963535,
        lon: 13.359976549887557,
        isPrivate: false,
        owner: 'admina'
    });

    addContact({
        firstName: 'Jane',
        lastName: 'Doe',
        street: 'Georgswerder Ring 1',
        city: 'Hamburg',
        state: 'Hamburg',
        country: 'Germany',
        zip: '21109',
        lat: 53.515454041624906,
        lon: 10.020539336041693,
        isPrivate: true,
        owner: 'admina'
    });
}

function handleLogin(event) {
    let username = event.target.username.value;
    let password = event.target.pwd.value;
    let user = users[username];

    if (user != null && user.password === password) {
        setLoggedUser(user);
    } else {
        alert('Die Anmeldung ist fehlgeschlagen!');
    }
}

function setLoggedUser(user) {
    let loginEl = document.getElementById('login');
    let loggedEls = document.getElementsByClassName('logged');
    let loginStyle = (user != null) ? 'none' : '';
    let loggedStyle = (user == null) ? 'none' : '';
    loginEl.style.display = loginStyle;

    document.getElementById('welcome-msg').innerHTML = "Hallo " + user.username + "!";

    for (let i = 0; i < loggedEls.length; i++) {
        loggedEls.item(i).style.display = loggedStyle;
    }
    loggedUser = user;
    updateContactView();
    map.updateSize();
}

function logout() {
    let loginEl = document.getElementById('login');
    let loggedEls = document.getElementsByClassName('logged');
    let loginStyle = '';
    let loggedStyle = 'none';
    loginEl.style.display = loginStyle;

    for (let i = 0; i < loggedEls.length; i++) {
        loggedEls.item(i).style.display = loggedStyle;
    }
    document.getElementById('pwd').value = ''
    document.getElementById('username').value = ''
    loggedUser = null;
}

function resetAllData() {
    logout();

    fetch(api_base_path + 'reset')
        .then(response => response.json())
}

function updateContactView(filter) {
    fetchContacts();
    let contacts = listContacts(filter);
    clearContactList();
    clearMap();

    for (let contactId in contacts) {
        let contact = contacts[contactId];
        addContactToList(contact);
        addContactToMap(contact);
    }
}

function addLoginUser(desc) {
    let user = deepCopy(desc);
    users[user.username] = user;
}

function filterOwnedContacts(contact) {
    return contact.owner === loggedUser.username;
}
