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
    let location = await lookupLatLon({street, zip, city, state, country});

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
    let location = await lookupLatLon({street, zip, city, state, country});

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
    // Set Selection
    console.log(selectedContact);
    let ownerSelect = document.getElementById('owner');
    ownerSelect.innerHTML = '';
    let adminaOption = document.createElement('option');
    let normaloOption = document.createElement('option');

    adminaOption.value = 'admina';
    normaloOption.value = 'normalo';

    if (loggedUser.username === 'normalo') {
        adminaOption.innerHTML = 'Admina';
        normaloOption.innerHTML = 'Self (normalo)';
    }
    if (loggedUser.username === 'admina') {
        adminaOption.innerHTML = 'Self (admina)';
        normaloOption.innerHTML = 'Normalo';
    }
    ownerSelect.appendChild(adminaOption);
    ownerSelect.appendChild(normaloOption);

    // Change Visibility
    if (!edit) {
        document.getElementById('popup-header-text').innerText = 'Add Contact';
        document.getElementById('btn-update-contact').style.display = 'none';
        document.getElementById('btn-delete-contact').style.display = 'none';
        document.getElementById('btn-add-contact').style.display = 'inline-block';
        setEmptyFormContent();
    } else {
        document.getElementById('popup-header-text').innerText = 'Update Contact';
        document.getElementById('btn-update-contact').style.display = 'inline-block';
        document.getElementById('btn-delete-contact').style.display = 'inline-block';
        document.getElementById('btn-add-contact').style.display = 'none';
        setFormContent();
    }

    if (!edit || loggedUser.username === selectedContact.owner || loggedUser.username === 'admina') {
        setDisabledToForm(false);
    } else {
        setDisabledToForm(true);
    }
    let popupDiv = document.getElementById('add-contact');
    popupDiv.style.display = 'block';
}

function setDisabledToForm(value) {
    document.getElementById('btn-delete-contact').disabled = value;
    document.getElementById('btn-update-contact').disabled = value;
    document.getElementById('btn-delete-contact').disabled = value;
    document.getElementById('firstName').disabled = value;
    document.getElementById('lastName').disabled = value;
    document.getElementById('street').disabled = value;
    document.getElementById('zip').disabled = value;
    document.getElementById('city').disabled = value;
    document.getElementById('state').disabled = value;
    document.getElementById('country').disabled = value;
    document.getElementById('privat').disabled = value;
    document.getElementById('owner').disabled = value;
}

function setFormContent() {
    document.getElementById('firstName').value = selectedContact.firstName;
    document.getElementById('lastName').value = selectedContact.lastName;
    document.getElementById('street').value = selectedContact.street;
    document.getElementById('zip').value = selectedContact.zip;
    document.getElementById('city').value = selectedContact.city;
    document.getElementById('state').value = selectedContact.state;
    document.getElementById('country').value = selectedContact.country;
    document.getElementById('privat').checked = selectedContact.isPrivate;
    document.getElementById('owner').value = selectedContact.owner;
}

function setEmptyFormContent() {
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('street').value = '';
    document.getElementById('zip').value = '';
    document.getElementById('city').value = '';
    document.getElementById('state').value = '';
    document.getElementById('country').value = '';
    document.getElementById('privat').checked = true;
    document.getElementById('owner').value = loggedUser.username;
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
