/**
 * Created by Daniel on 27.07.2016.
 * This file contains the setup of the server.
 */

"use strict";

// import necessary modules
var path = require("path");
var http = require("http");
var colors = require("colors");
var express = require("express");
var favicon = require("serve-favicon");
var bodyParser = require("body-parser");
var stormpath = require("express-stormpath");
var logger = require("./logger.js");

var oApp = express();
var iPORT = 8080;

console.log("SETTING UP THE SERVER...");

// middleware
// log routes
oApp.use(function(oReq, oRes, fNext) {
    console.log(colors.yellow(oReq.method + "\t" + oReq.url));
    fNext();
});
// support JSON encoded bodies
oApp.use(bodyParser.json());
// support encoded bodies
oApp.use(bodyParser.urlencoded({extended: true}));
// configure stormpath
oApp.use(stormpath.init(oApp, {
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
// serve favicon
oApp.use(favicon(path.join(__dirname, "frontend", "img", "favicon.ico")));
// serve static files in frontend folder
oApp.use(
    stormpath.loginRequired, express.static(
        __dirname + "/frontend" + (process.argv[2] === "sapui5" ? "_sapui5" : "")
    )
);

// include routes
require("./routes/routes-customers.js")(oApp);
require("./routes/routes-invoices.js")(oApp);
require("./routes/routes-stats.js")(oApp);
require("./routes/routes-cash-earnings")(oApp);

// bind application to port
http.createServer(oApp).listen(iPORT);

oApp.on("stormpath.ready", function() {
    logger.log(logger.levels.INFO, "Application (re)started")
    console.log(colors.green("Server listens on port " + iPORT + "."));
    console.log(colors.magenta("Requests:"));
});
