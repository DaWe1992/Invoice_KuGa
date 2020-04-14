/**
 * Created by Daniel on 11.08.2017.
 * This file contains the setup of passport.
 */

"use strict";

// import necessary modules
var login = require("./login.js");

module.exports = function(passport) {
	
	passport.serializeUser(function(oUser, done) {
		done(null, oUser);
	});

	passport.deserializeUser(function(oUser, done) {
		done(null, oUser);
	});

    // set up passport strategies for login
    login(passport);
};
