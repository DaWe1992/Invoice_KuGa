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
var mongoose = require("mongoose");
var passport = require("passport");
var flash = require("connect-flash");
var favicon = require("serve-favicon");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var expressSession = require("express-session");

var config = require("./config.js");
var logger = require("./logger/logger.js");
var isAuthenticated = require("./passport/isAuthenticated.js");

var oApp = express();

console.log("SETTING UP THE SERVER...");

// connect to mongo db
mongoose.connect(config.mongo.url, {
    useMongoClient: true
});

// middleware
// log routes
oApp.use(function(oReq, oRes, fNext) {
    console.log(colors.yellow(oReq.method + "\t" + oReq.url));
    fNext();
});

// setup jade for authentication
oApp.set("views", path.join(__dirname, "passport", "views"));
oApp.set("view engine", "jade");

// support JSON encoded bodies
oApp.use(bodyParser.json());
// support encoded bodies
oApp.use(bodyParser.urlencoded({extended: true}));
oApp.use(cookieParser());

// initialize passport.js
oApp.use(expressSession({
    secret: config.session.secret,
    resave: config.session.resave,
    saveUninitialized: config.session.saveUninitialized,
    cookie: {
        maxAge: config.session.cookieMaxAge
    }
}));
oApp.use(passport.initialize());
oApp.use(passport.session());

var initPassport = require("./passport/initPassport.js");
initPassport(passport);

// flash middleware to store messages in session
oApp.use(flash());

// include routes
require("./routes/routes-customers.js")(oApp);
require("./routes/routes-invoices.js")(oApp);
require("./routes/routes-cash-earnings")(oApp);
require("./routes/routes-stats.js")(oApp);
require("./routes/routes-excel.js")(oApp);
require("./routes/routes-logs.js")(oApp);
require("./routes/routes-authentication")(oApp, passport);

// serve favicon
oApp.use(favicon(path.join(__dirname, "frontend", "img", "favicon.ico")));
// serve static files in frontend(_sapui5) folder
oApp.use(
    isAuthenticated, express.static(
        __dirname + "/frontend" + config.frontend
    )
);

// bind application to port
http.createServer(oApp).listen(config.app.port, function() {
    logger.log(logger.levels.INFO, "Application (re)started");
    console.log(colors.green("Server listens on port " + config.app.port + "."));
    console.log(colors.magenta("Requests:"));
});
