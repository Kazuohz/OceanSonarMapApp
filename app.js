"use strict";

const express = require("express");
const app = express();

const { spawn } = require("child_process");

const multer = require("multer");

const cors = require("cors");

// for application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true})); // built-in middleware
// for application/json
app.use(express.json()); // built-in middleware
// for multipart/form-data (required with FormData)
app.use(multer().none()); // requires the "multer" modules
app.use(cors()); // enables CORS for all origins (for development)

app.get("/sonar/test/:number", (req, res) => {
    const number = req.params.number;
    runPythonScript("app.py", [number], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.type("text").send(`Factorial of ${number} is ${result}`);
        }
    });
});

function runPythonScript(scriptPath, args, callback) {
    const pythonProcess = spawn("python", [scriptPath].concat(args));

    let data = "";
    pythonProcess.stdout.on("data", (chunk) => {
        data += chunk.toString();
    });

    pythonProcess.stderr.on("data", (error) => {
        console.error(`stderr: ${error}`);
    });

    pythonProcess.on("close", (code) => {
        if (code !== 0) {
            console.log(`Python script exited with code ${code}`);
            callback(`Error: Script exited with code ${code}`, null);
        } else {
            console.log("Python script execuded successfully");
            console.log(data);
            callback(null, data);
        }
    });
}

// tells the code to serve static files in a directory called public
app.use(express.static("public"));
// specify the port to listen to
const PORT = process.env.PORT || 8000;
// tells the application to run on the specified port
app.listen(PORT);
