/**
 * Created by Daniel on 14.08.2017.
 * This file contains all routes concerning the users.
 */

"use strict";

// import necessary modules
var mongoose = require("mongoose");
var config = require("../config.js");
var logger = require("../logger/logger.js");
var isAuthenticated = require("../passport/isAuthenticated.js");

module.exports = function(oApp) {

    /**
     * Gets all users.
     *
     * @name /users
     */
    oApp.get("/users", isAuthenticated, function(oReq, oRes) {
        var oConnection = mongoose.connection;

        oConnection.db.collection("users", function(oErr, oCollection) {
            if(oErr) {
                logger.log(logger.levels.ERR, oErr);
                return oRes.status(500).json({
                    "success": false,
                    "err": oErr
                });
            }

            oCollection.find({}).toArray(function(oErr, aData) {
                if(oErr) {
                    logger.log(logger.levels.ERR, oErr);
                    return oRes.status(500).json({
                        "success": false,
                        "err": oErr
                    });
                }

                return oRes.status(200).json({
                    "success": true,
                    "data": aData
                });
            })
        });
    });
};
