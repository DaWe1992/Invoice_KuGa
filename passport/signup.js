/**
 * Created by Daniel on 11.08.2017.
 */

"use strict";

// import necessary modules
var LocalStrategy   = require("passport-local").Strategy;
var User = require("./models/user.js");
var bCrypt = require("bcrypt-nodejs");
var logger = require("../logger/logger.js");

module.exports = function(passport){

	passport.use("signup", new LocalStrategy({
            passReqToCallback: true
        },
        function(oReq, sUsername, sPassword, fDone) {

            var findOrCreateUser = function() {

                // find a user in mongo with username provided
                User.findOne({"username": sUsername }, function(oErr, oUser) {

                    // in case of any error, return using the done method
                    if(oErr){
                        logger.log(logger.levels.ERR, "Error in signup: " + oErr);
                        return fDone(oErr);
                    }

                    // user already exists
                    if(oUser) {
                        logger.log(logger.levels.ERR, "User already exists with username: " + sUsername);
                        return fDone(null, false, oReq.flash("message", "User exists already"));
                    } else {
                        // if there is no user
                        var oNewUser = new User();

                        // set the user's local credentials
                        oNewUser.username = sUsername;
                        oNewUser.password = createHash(sPassword);
                        oNewUser.email = oReq.param("email");
                        oNewUser.firstName = oReq.param("firstName");
                        oNewUser.lastName = oReq.param("lastName");

                        // save the user
                        oNewUser.save(function(oErr) {
                            if(oErr){
                                logger.log(logger.levels.ERR, "Error saving user: " + oErr);
                                throw err;
                            }

                            logger.log(logger.levels.INFO, "User registration successfull");
                            return fDone(null, oNewUser);
                        });
                    }
                });
            };

            // delay the execution of findOrCreateUser() and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );

    /**
     * Generates hash using bCrypt.
     *
     * @param sPassword
     */
    var createHash = function(sPassword){
        return bCrypt.hashSync(sPassword, bCrypt.genSaltSync(10), null);
    }
};
