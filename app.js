"use strict";

const express = require("express");
const app = express();

const multer = require("multer");

const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");

// for application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true})); // built-in middleware
// for application/json
app.use(express.json()); // built-in middleware
// for multipart/form-data (required with FormData)
app.use(multer().none()); // requires the "multer" modules

app.get("/maps", async function(req, res) {
    let action = req.query.search;
    if (action) {
        try {
            let db = await getDBConnection();
            let rows = await db.all(queryCreator("blah", action));
            await db.close();
            res.json({
                "yips": rows
            });
        } catch (error) {
            console.error(error);
            res.status(500).type("text");
            res.send("An error occured on the server. Try again later.");
        }
    } else {
        try {
            let db = await getDBConnection();
            let data = await db.all(queryCreator("blah2", null));
            await db.close();
            res.json({
                "yips": data
            });
        } catch (error) {
            console.error(error);
            res.status(500).type("text");
            res.send("An error occured on the server. Try again later.");
        }
    }
});

/**
 * Helper method to lesson time processing queries for the first get call.
 * @param {DB_CALL} type Type of call into the database. 
 * @param {String} data Actual Call.
 * @returns {String} Call command.
 */
function queryCreator(type, data) {
    return "SELECT * FROM blah ORDER BY DATETIME(date) DESC;";
}

/**
 * Dedicated method to establishing a connetion with a database.
 * @returns {DATABASE} Connected SQL database.
 */
async function getDBConnection() {
    const db = await sqlite.open({
        filename: 'yipper.db',
        driver: sqlite.Database
    });
    return db;
}