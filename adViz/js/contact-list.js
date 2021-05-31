let selectedContact = null;



function addContactToList(contact) {
    let nameEl = document.createElement('li');
    nameEl.dataset.contact = contact.id;
    nameEl.classList.add('contact-item');
    let publicInfo = "";
    if (contact.isPrivate) {
        publicInfo = "<i>(Private)</i>";
    }
    nameEl.innerHTML = `${contact.firstName} ${contact.lastName}<br><small class="text-secondary">Owner: ${contact.owner} ${publicInfo}</small>`;
    nameEl.onclick = () => {
        selectedContact = contact;
        openPopup(true);
    };
    let namesEl = document.getElementById('name-list');
    namesEl.appendChild(nameEl);
}

function clearContactList() {
    let namesEl = document.getElementById('name-list');
    namesEl.innerHTML = '';
}

async function handleUserForm(event) {
    let action = event.submitter.name;

    try {
        if (action === 'add') {
            await handleAdd(event);
        } else if (action === 'update') {
            await handleUpdate(event);
        }
        closePopup();
        updateContactView();
    } catch (err) {
        console.error(err);
        alert('Die gewünschte Aktion konnte nicht ausgeführt werden!');
    }
}

async function handleAdd(event) {
    let firstName = event.target.firstName.value;
    let lastName = event.target.lastName.value;
    let street = event.target.street.value;
    let zip = event.target.zip.value;
    let city = event.target.city.value;
    let state = event.target.state.value;
    let country = event.target.country.value;
    let isPrivate = event.target.privat.checked;
    let owner = event.target.owner.value;
    let location = await lookupLatLon({ street, zip, city, state, country });

    addContact({
        firstName, lastName,
        street, zip, city, state, country,
        isPrivate, owner,
        lat: location.lat,
        lon: location.lon
    });
}

async function handleUpdate(event) {
    let firstName = event.target.firstName.value;
    let lastName = event.target.lastName.value;
    let street = event.target.street.value;
    let zip = event.target.zip.value;
    let city = event.target.city.value;
    let state = event.target.state.value;
    let country = event.target.country.value;
    let isPrivate = event.target.privat.checked;
    let owner = event.target.owner.value;
    let location = await lookupLatLon({ street, zip, city, state, country });

    updateContact({
        id: selectedContact.id,
        firstName, lastName,
        street, zip, city, state, country,
        isPrivate, owner,
        lat: location.lat,
        lon: location.lon
    });
}

function openPopup(edit) {
    if (!edit) {
        document.getElementById('popup-header-text').innerText = 'Add Contact';
        document.getElementById('btn-update-contact').style.display = 'none';
        document.getElementById('btn-delete-contact').style.display = 'none';
        document.getElementById('btn-add-contact').style.display = 'inline-block';
    } else {
        document.getElementById('popup-header-text').innerText = 'Update Contact';
        document.getElementById('btn-update-contact').style.display = 'inline-block';
        document.getElementById('btn-delete-contact').style.display = 'inline-block';
        document.getElementById('btn-add-contact').style.display = 'none';
    }
    let popupDiv = document.getElementById('add-contact');
    popupDiv.style.display = 'block';
}

function closePopup() {
    let popupDiv = document.getElementById('add-contact');
    popupDiv.style.display = 'none';
    selectedContact = null;
}

function handleDelete() {
    try {
        deleteContact(selectedContact.id);
        closePopup();
        updateContactView();
    } catch (err) {
        alert('Die gewünschte Aktion konnte nicht ausgeführt werden!');
    }
}
