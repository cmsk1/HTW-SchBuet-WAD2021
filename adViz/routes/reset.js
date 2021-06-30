const express = require('express');
const router = express.Router();
const config = require("../config/mongodb");
const MongoClient = require('mongodb').MongoClient;
const db = config.database;

/* GET reset data listing.
* Dies ist eine optionale Funktion und dient nur der einfachen bedienung. Dies ist also keine Anforderung aus dem Beleg 3
*/
router.get('/', function (request, response, next) {
    MongoClient.connect(db.url, {useUnifiedTopology: true},
        function (err, client) {
            if (err) throw err;
            let db = client.db("advizDB");

            // Drop DB to clean data
            db.dropDatabase();

            // Insert Users
            const admina = {username: "admina", password: "1234", isAdmin: true};
            const normalo = {username: "normalo", password: "abc", isAdmin: false};
            const contacts = [
                {
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
                },
                {
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
                },
                {
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
                },
                {
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
                }
            ];

            db.collection("users").insertMany([admina, normalo], {ordered: true}, function (err, res) {
                if (err) throw err;

                // Insert Contacts after users are successful
                db.collection("contacts").insertMany(contacts, {ordered: true}, function (err, res) {
                    if (err) throw err;
                    // close client
                    client.close();
                    response.status(200).send(true);
                });
            });
        });
});

module.exports = router;
