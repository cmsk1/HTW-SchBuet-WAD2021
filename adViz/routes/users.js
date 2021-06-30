const express = require('express');
const router = express.Router();
const config = require("../config/mongodb");
const MongoClient = require('mongodb').MongoClient;
const db_conf = config.database;

/* POST users listing. */
router.post('/', function (req, response, next) {

    if (typeof req.body.username == 'undefined' || typeof req.body.password == 'undefined') {
        response.sendStatus(400);
    } else {
        MongoClient.connect(db_conf.url, {useUnifiedTopology: true},
            function (err, client) {
                if (err) {
                    response.sendStatus(400);
                }
                let db = client.db(db_conf.name);
                db.collection("users").findOne({username: req.body.username}, function (err, result) {
                    if (err || !result) {
                        response.sendStatus(400);
                    } else {
                        if (result.username === req.body.username && result.password === req.body.password) {
                            response.status(200).send(result);
                        } else {
                            response.sendStatus(401);
                        }
                        client.close();
                    }
                })
            });
    }
});

router.get('/all', function (req, response, next) {

    MongoClient.connect(db_conf.url, {useUnifiedTopology: true},
        function (err, client) {
            if (err) {
                response.sendStatus(400);
            }
            let db = client.db(db_conf.name);
            db.collection("users").find({}).toArray(
                function (err, result) {
                    if (err) {
                        response.sendStatus(400);
                    }
                    client.close();
                    response.status(200).json(result);
                });
        });
});

module.exports = router;
