/**
 * Created by Daniel on 11.08.2016.
 * This file contains the db module.
 * It wraps the db connection and query process.
 */

 "use strict";

// import necessary modules
var pg = require("pg");
var config = require("./config.js");
var logger = require("./logger/logger.js");

var oPool = new pg.Pool(config.postgres);

module.exports = {

    /**
     * Queries the database.
     * @param sSql (sql string to be executed)
     * @param fCallback
     */
    query: function(sSql, fCallback) {
        // execute sql
        oPool.connect(function(oErr, oClient, fDone) {
            oClient.query(sSql, function(oErr, oResult) {
                fDone();
                fCallback(oErr, oResult);
            });
        });
    }
};
