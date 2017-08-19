/**
 * Created by Daniel on 14.08.2017.
 * This file contains all routes concerning the logs.
 */

"use strict";

// import necessary modules
var db = require("../db.js");
var logger = require("../logger/logger.js");
var isAuthenticated = require("../passport/isAuthenticated.js");

module.exports = function(oApp) {

    /**
     * Returns all logs.
     *
     * @name /logs
     */
    oApp.get("/logs", isAuthenticated, function(oReq, oRes) {
        var oResponse = {
            "count": {
                "total": "",
                "info": "",
                "warn": "",
                "erro": ""
            },
            "logs": [] // log messages
        }

        var sSql = "SELECT " +
            "log_status AS status, " +
            "log_text AS text, " +
            "log_date AS date " +
        "FROM " +
            "logs;";

        db.query(sSql, function(oErr, oResult) {
            if(oErr) {
                logger.log(logger.levels.ERR, oErr);
                return oRes.status(500).json({
                    "success": false,
                    "err": oErr
                });
            }

            oResponse.count.total = oResult.rows.length;
            oResponse.logs = oResult.rows;

            sSql = "SELECT " +
                "log_status AS status, " +
                "COUNT(*) AS count " +
            "FROM " +
                "logs " +
            "GROUP BY log_status;";

            db.query(sSql, function(oErr, oResult) {
                if(oErr) {
                    logger.log(logger.levels.ERR, oErr);
                    return oRes.status(500).json({
                        "success": false,
                        "err": oErr
                    });
                }

                oResponse.count.erro = getCorrespondingCount("ERRO", oResult.rows);
                oResponse.count.info = getCorrespondingCount("INFO", oResult.rows);
                oResponse.count.warn = getCorrespondingCount("WARN", oResult.rows);

                return oRes.status(200).json({
                    "success": true,
                    "data": oResponse
                });
            });
        });
    });
}

/**
 * Returns the number of logs
 * for the log level specified.
 *
 * @param sStatus (log level)
 * @param aArr (array)
 * @return
 */
function getCorrespondingCount(sStatus, aArr) {
	var iCount = 0;

    // iterate the array
	for(var i = 0; i < aArr.length; i++) {
    	if(aArr[i].status === sStatus) {
        	iCount = Number(aArr[i].count);
        }
    }

    return iCount;
}
