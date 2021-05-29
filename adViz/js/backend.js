function addContact(desc) {
    let contact = deepCopy(desc);
    let contacts = getLocalContacts();
    let id = `${desc.lat}-${desc.lon}`;
    contacts[id] = contact;
    setLocalContacts(contacts);
    return true;
}

function listContacts(user) {
    if (user == null) return {};
    let allContacts = getLocalContacts();
    let scoped = {};

    for (let contactId in allContacts) {
        let contact = allContacts[contactId];

        if (contact.isPublic || user.isAdmin || contact.owner === user.username) {
            scoped[contactId] = contact;
        }
    }
    return scoped;
}

/* Local Storage Helper */

function getLocalContacts() {
    let encoded = localStorage.getItem('contacts');
    if (encoded == null) return {};
    return JSON.parse(encoded);
}

function setLocalContacts(contacts) {
    let encoded = JSON.stringify(contacts);
    localStorage.setItem('contacts', encoded);
}
