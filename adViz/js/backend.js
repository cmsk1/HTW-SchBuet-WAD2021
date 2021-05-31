let contacts = {};

function addContact(desc) {
    let contact = deepCopy(desc);
    let contacts = getLocalContacts();
    let id = hash(`${desc.firstName}-${desc.lastName}-${desc.lat}-${desc.lon}`);
    contact.id = id;
    contacts[id] = contact;
    setLocalContacts(contacts);
}

function updateContact(contact) {
    deleteContact(contact.id);
    addContact(contact);
}

function deleteContact(contactId) {
    let toDelete = contacts[contactId];
    let isOwned = (toDelete.owner != loggedUser.username);

    if (isOwned && !loggedUser.isAdmin) {
        throw new Error('not permitted');
    }
    delete contacts[contactId];
    setLocalContacts(contacts);
}

function fetchContacts() {
    if (loggedUser != null) {
        let allContacts = getLocalContacts();
        
        contacts = filterObj(allContacts, (id, contact) => {
            let isOwner = (contact.owner === loggedUser.username);
            return isOwner || !contact.isPrivate || loggedUser.isAdmin;
        });
    } else {
        contacts = {};
    }
}

function listContacts(filter) {
    return filterObj(contacts, (key, contact) => {
        if (filter == null) return true;
        return filter(contact)
    });
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
