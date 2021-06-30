const express = require('express');
const router = express.Router();
const config = require("../config/mongodb");
const MongoClient = require('mongodb').MongoClient;
const db = config.database;

/* POST users listing. */
router.post('/', function (req, res, next) {

    if (typeof req.body.username == 'undefined' || typeof req.body.password == 'undefined') {
        res.sendStatus(400);
    } else {
        MongoClient.connect(db.url, {useUnifiedTopology: true},
            function (err, client) {
                if (err) throw err;
                let db = client.db("advizDB");
                db.collection("users").findOne({username: req.body.username}, function (err, result) {
                    if (err) throw err;

                    if (result.username === req.body.username && result.password === req.body.password) {
                        res.status(200).send(result);
                    } else {
                        res.sendStatus(401);
                    }
                    client.close();
                })
            });
    }
});

module.exports = router;
