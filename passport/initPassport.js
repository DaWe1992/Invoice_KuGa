/**
 * Created by Daniel on 11.08.2017.
 * This file contains the setup of passport.
 */

"use strict";

// import necessary modules
var login = require("./login.js");
var signup = require("./signup.js");
var User = require("./models/user.js");

module.exports = function(passport) {

	// passport needs to be able to serialize and
    // deserialize users to support persistent login sessions

    // serialization
    passport.serializeUser(function(oUser, fDone) {
        fDone(null, oUser._id);
    });

    // deserialization
    passport.deserializeUser(function(sId, fDone) {
        User.findById(sId, function(oErr, oUser) {
            fDone(oErr, oUser);
        });
    });

    // set up passport strategies for login and registration
    login(passport);
    signup(passport);
};
