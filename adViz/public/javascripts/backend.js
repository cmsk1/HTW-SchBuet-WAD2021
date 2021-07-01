let users = {};
let contacts = {};

const API_BASE_URL = 'http://localhost:3000/';

async function deleteContact(contactID) {
    try {
        await fetch(`${API_BASE_URL}contacts/${contactID}`, {
            method: 'DELETE',
        });
        getContacts(loggedUser._id, showPrivate);
    } catch (err) {
        console.error('Error:', err);
        alert('Es ist ein Fehler aufgetreten!');
    }
}

async function postContact(body) {
    try {
        await fetch(`${API_BASE_URL}contacts/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
        getContacts(loggedUser._id, showPrivate);
    } catch (err) {
        console.error('Error:', err);
        alert('Es ist ein Fehler aufgetreten!');
    }
}

async function putContact(contactID, body) {
    try {
        await fetch(`${API_BASE_URL}contacts/${contactID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
        getContacts(loggedUser._id, showPrivate);
    } catch (err) {
        console.error('Error:', err);
        alert('Es ist ein Fehler aufgetreten!');
    }
}

async function getContacts(userId, showPrivate) {
    this.showPrivate = showPrivate;

    try {
        let response = await fetch(`${API_BASE_URL}contacts/?userId=${userId}&showPublic=${showPrivate}`, {
            method: 'GET',
        });
        let data = await response.json();
        return data;
    } catch (err) {
        console.error('Error:', err);
        alert('Es ist ein Fehler aufgetreten!');
    }
}

async function getAllUsers() {
    try {
        let response = await fetch(`${API_BASE_URL}users/all/`, {
            method: 'GET',
        });
        users = await response.json();
    } catch (err) {
        console.error('Error:', err);
        alert('Es ist ein Fehler aufgetreten!');
    }
}

async function loginRequest(body) {
    try {
        let response = await fetch(`${API_BASE_URL}users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
        let user = await response.json();
        setLoggedUser(user);
    } catch (err) {
        alert('Die Anmeldung ist fehlgeschlagen!');
    }
}

async function resetDatabase() {
    try {
        let response = await fetch(`${API_BASE_URL}reset`);
        let data = await response.json();
        console.log('Success:', data);
    } catch (err) {
        console.error('Error:', err);
    }
}

function addContact(desc) {
    let contact = deepCopy(desc);
    postContact(contact).then(r => console.log('Contact added'));
}

function updateContact(id, contact) {
    putContact(id, contact).then(r => console.log('Contact updated'));
}

function listContacts(filter) {
    return filterObj(contacts, (key, contact) => {
        if (filter == null) return true;
        return filter(contact)
    });
}
