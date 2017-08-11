/**
 * Created by Daniel on 11.08.2017.
 */

"use strict";

// import necessary modules
var LocalStrategy   = require("passport-local").Strategy;
var User = require("./models/user.js");
var bCrypt = require("bcrypt-nodejs");
var logger = require("../logger/logger.js");

module.exports = function(passport) {

    /**
     * Configure login strategy.
     */
	passport.use("login", new LocalStrategy({
            passReqToCallback: true
        },
        function(oReq, sUsername, sPassword, fDone) {

            // check in mongo if a user with username exists or not
            User.findOne({"username": sUsername},
                function(oErr, oUser) {
                    if(oErr) {
                        logger.log(logger.levels.ERR, oErr);
                        return fDone(oErr);
                    }

                    // username does not exist, log the error and redirect back
                    if(!oUser) {
                        logger.log(logger.levels.ERR, "User not found with username " + sUsername);
                        return fDone(null, false, oReq.flash("message", "User not found."));
                    }

                    // user exists but wrong password, log the error
                    if(!isValidPassword(oUser, sPassword)) {
                        logger.log(logger.levels.ERR, "Invalid password");
                        // redirect to login page
                        return fDone(null, false, oReq.flash("message", "Invalid Password"));
                    }

                    // both user and password match, return user
                    return fDone(null, oUser);
                }
            );

        })
    );

    /**
     * Check if the password provided is valid.
     *
     * @param oUser
     * @param sPassword
     * @return
     */
    var isValidPassword = function(oUser, sPassword){
        return bCrypt.compareSync(sPassword, oUser.password);
    }
};
