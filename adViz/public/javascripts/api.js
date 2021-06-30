async function deleteContact(contactID) {
    fetch(api_base_path + 'contacts/' + contactID, {
        method: 'DELETE',
    }).then((data) => getContacts(loggedUser._id, showPrivate))
        .catch((error) => {
            console.error('Error:', error);
            alert('Es ist ein Fehler aufgetreten!');
        });
}

async function postContact(body) {
    fetch(api_base_path + 'contacts/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    }).then((data) => getContacts(loggedUser._id, showPrivate))
        .catch((error) => {
            console.error('Error:', error);
            alert('Es ist ein Fehler aufgetreten!');
        });
}

async function putContact(contactID, body) {
    fetch(api_base_path + 'contacts/' + contactID, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    }).then((data) => getContacts(loggedUser._id, showPrivate))
        .catch((error) => {
            console.error('Error:', error);
            alert('Es ist ein Fehler aufgetreten!');
        });
}

async function getContacts(userId, showPrivate) {
    this.showPrivate = showPrivate;
    fetch(api_base_path + 'contacts/?userId=' + userId + '&showPublic=' + showPrivate, {
        method: 'GET',
    })
        .then(response => response.json())
        .then((data) => updateContactViewFromApi(data))
        .catch((error) => {
            console.error('Error:', error);
            alert('Es ist ein Fehler aufgetreten!');
        });
}

async function getAllUsers() {
    fetch(api_base_path + 'users/all/', {
        method: 'GET',
    })
        .then(response => response.json())
        .then((data) => users = data)
        .catch((error) => {
            console.error('Error:', error);
            alert('Es ist ein Fehler aufgetreten!');
        });
}

async function loginRequest(body) {
    fetch(api_base_path + 'users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    }).then((response) => response.json())
        .then((data) => setLoggedUser(data))
        .catch((error) => {
            alert('Die Anmeldung ist fehlgeschlagen!');
        });
}
