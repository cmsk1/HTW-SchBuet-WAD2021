let users = {};
let contacts = {};

const API_BASE_URL = 'http://localhost:3000/';

async function deleteContact(contactID) {
    try {
        await fetch(`${API_BASE_URL}contacts/${contactID}`, {
            method: 'DELETE',
        });
        fetchContacts(loggedUser._id, showAllContacts);
    } catch (err) {
        console.error('Error:', err);
        alert('Es ist ein Fehler aufgetreten!');
    }
}

async function addContact(body) {
    try {
        await fetch(`${API_BASE_URL}contacts/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
        fetchContacts(loggedUser._id, showAllContacts);
    } catch (err) {
        console.error('Error:', err);
        alert('Es ist ein Fehler aufgetreten!');
    }
}

async function updateContact(contactID, body) {
    try {
        await fetch(`${API_BASE_URL}contacts/${contactID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
        fetchContacts(loggedUser._id, showAllContacts);
    } catch (err) {
        console.error('Error:', err);
        alert('Es ist ein Fehler aufgetreten!');
    }
}

async function fetchContacts(userId, showPublic) {
    showAllContacts = showPublic;

    try {
        let response = await fetch(`${API_BASE_URL}contacts/?userId=${userId}&showPublic=${showPublic}`, {
            method: 'GET',
        });
        contacts = await response.json();
        updateContactViewFromApi(contacts);
    } catch (err) {
        console.error('Error:', err);
        alert('Es ist ein Fehler aufgetreten!');
    }
}

async function fetchAllUsers() {
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

function listContacts(filter) {
    return filterObj(contacts, (key, contact) => {
        if (filter == null) return true;
        return filter(contact)
    });
}
