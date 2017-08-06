/**
 * Created by Daniel on 27.07.2016.
 * This file contains the setup of the server.
 */

 /**
  * TODO Backend:
  * Error log
  * Refactoring: Naming variables (hungarian notation)
  * Upper/Lower case in comments
  */

"use strict";

// Import necessary modules
var path = require("path");
var http = require("http");
var colors = require("colors");
var express = require("express");
var favicon = require("serve-favicon");
var bodyParser = require("body-parser");
var stormpath = require("express-stormpath");

var app = express();
var port = 8080;

console.log("\nSETTING UP THE SERVER...");
console.log("========================\n");

// **** MIDDLEWARE ****
// Log routes
app.use(function(req, res, next) {
    console.log(colors.yellow(req.method + "\t" + req.url));
    next();
});

app.use(bodyParser.json()); // Support JSON encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Support encoded bodies

// Configure stormpath
app.use(stormpath.init(app, {
    client: {
        apiKey: {
            file: "./stormpath/apiKey.properties"
        }
    },
    web: {
        login: {
            enabled: true
        },
        logout: {
            enabled: true
        },
        me: {
            enabled: true
        },
        oauth2: {
            enabled: false
        },
        register: {
            enabled: true
        }
    },
    application: {
        href: "https://api.stormpath.com/v1/applications/onkfEfUjnUWO6qMg4y5J7",
    }
}));

// Serve favicon
app.use(favicon(path.join(__dirname, "frontend", "img", "favicon.ico")));

// Serve static files in frontend folder
app.use(stormpath.loginRequired, express.static(
    __dirname + "/frontend" + (process.argv[2] === "sapui5" ? "_sapui5" : "")
));

// **** ROUTES ****
// Include routes
console.log("Including routes...");

require("./routes/routes-customers.js")(app);
require("./routes/routes-invoices.js")(app);
require("./routes/routes-stats.js")(app);
require("./routes/routes-cash-earnings")(app);

console.log(colors.green("Success.\n"));

// **** BIND APP TO PORT ****
// Create the server and bind app to the port
console.log("Binding application to port...");
http.createServer(app).listen(port, function() {
    console.log(colors.green("Success. Magic happens on port " + port + "!"));
});

app.on("stormpath.ready", function() {
    console.log(colors.green("Stormpath ready!\n"));
    console.log(colors.cyan(">> Application ready <<\n"));
    console.log(colors.magenta("Requests:\n=========\n"));
});
