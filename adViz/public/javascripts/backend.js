let contacts = {};

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
