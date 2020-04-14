/**
 * Created by Daniel on 11.08.2017.
 */

"use strict";

// import necessary modules
var LocalStrategy   = require("passport-local").Strategy;
var user 			= require("./user.js");

// ==============================================================

module.exports = function(passport) {
	
    /**
     * Configure login strategy.
     */
	passport.use("login", new LocalStrategy({
            passReqToCallback: true
        },
        function(oReq, sUsername, sPassword, fDone) {
			var oUser = user.findByName(sUsername);
			
			// user was not found
			if(!oUser) {
				return fDone(null, false, oReq.flash("message", "User not found"));
			}
			
			// user was found
			// ...but wrong password
			if(sPassword != oUser.password) {
				return fDone(null, false, oReq.flash("message", "Invalid password"));
			}
			
			// user could be authenticated, return user
			return fDone(null, oUser);
        })
    );
};