let users = {};
let loggedUser = null;
let showPrivate = false;


function initAdviz() {
    createMap();
}

function handleLogin(event) {
    let username = event.target.username.value;
    let password = event.target.pwd.value;
    let data = {username: username, password: password};

    loginRequest(data).then(r =>
        getAllUsers().then(r2 => {
        }));
}

function setLoggedUser(user) {
    let loginEl = document.getElementById('login');
    let loggedEls = document.getElementsByClassName('logged');
    let loginStyle = (user != null) ? 'none' : '';
    let loggedStyle = (user == null) ? 'none' : '';
    loginEl.style.display = loginStyle;

    document.getElementById('welcome-msg').innerHTML = "Hello " + user.username + "!";

    for (let i = 0; i < loggedEls.length; i++) {
        loggedEls.item(i).style.display = loggedStyle;
    }
    loggedUser = user;
    getContacts(loggedUser._id, showPrivate).then(r =>
        updateContactViewFromApi(r))
    map.updateSize();
}

function updateContactViewFromApi(contacts) {
    clearContactList();
    clearMap();
    for (let contact of contacts) {
        addContactToList(contact);
        addContactToMap(contact);
    }
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
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

