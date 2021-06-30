const express = require('express');
const router = express.Router();
const config = require("../config/mongodb");
const mongodb = require("mongodb");
const MongoClient = require('mongodb').MongoClient;
const db_conf = config.database;

/* GET contacts listing. */
router.get('/', function (req, response, next) {
    let userId = new mongodb.ObjectId(req.query.userId);
    let showPublic = (req.query.showPublic && req.query.showPublic.toString() === 'true');

    MongoClient.connect(db_conf.url, {useUnifiedTopology: true},
        function (err, client) {
            if (err) {
                response.sendStatus(400);
            }

            // Filter für nur eigene oder "all contact" setzen
            let filter = {};
            let db = client.db(db_conf.name);
            db.collection("users").findOne({_id: userId}, function (err, result) {
                if (err) response.sendStatus(400);
                if (result == null) {
                    response.sendStatus(400);
                } else {
                    if (showPublic) { // wenn auch public, gibt es einen unterschied zwischen isAdmin (sieht alles) oder eben nicht
                        if (result.isAdmin) {
                            filter = {};
                        } else {
                            filter = {$or: [{owner: result.username}, {isPrivate: false}]};
                        }
                    } else { // wenn nur eigene -> filter nach owner egal wer anfragt
                        filter = {owner: result.username};
                    }
                    db.collection("contacts").find(filter).toArray(
                        function (err, result) {
                            if (err) {
                                response.sendStatus(400);
                            }
                            client.close();
                            response.status(200).json(result);
                        });
                }
            })
        });
});

router.post('/', function (req, response, next) {
    const data = req.body;

    MongoClient.connect(db_conf.url, {useUnifiedTopology: true},
        function (err, client) {
            if (err) {
                response.sendStatus(400);
            }
            let db = client.db(db_conf.name);

            db.collection("contacts").insertOne(data, {ordered: true}, function (err, res) {
                if (err) {
                    response.sendStatus(400);
                }
                client.close();
                response.location('/contacts/' + res.insertedId)
                response.sendStatus(201);
            });
        });
});

router.put('/:id', function (req, response, next) {
    const data = {$set: req.body};
    let id = new mongodb.ObjectId(req.params.id);

    MongoClient.connect(db_conf.url, {useUnifiedTopology: true},
        function (err, client) {
            if (err) {
                response.sendStatus(400);
            }
            let db = client.db(db_conf.name);

            db.collection("contacts").updateOne({_id: id}, data, function (err, res) {
                if (err) {
                    response.sendStatus(400);
                }
                client.close();
                response.sendStatus(204);
            });
        });
});

router.delete('/:id', function (req, response, next) {
    let id = new mongodb.ObjectId(req.params.id);

    MongoClient.connect(db_conf.url, {useUnifiedTopology: true},
        function (err, client) {
            if (err) {
                response.sendStatus(400);
            }
            let db = client.db(db_conf.name);

            db.collection("contacts").deleteOne({_id: id}, function (err, res) {
                if (err) {
                    response.sendStatus(400);
                }
                client.close();
                response.sendStatus(204);
            });
        });
});


module.exports = router;
