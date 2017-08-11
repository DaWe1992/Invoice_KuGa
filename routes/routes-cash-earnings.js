/**
 * Created by Daniel on 15.06.2017.
 * This file contains all routes concerning the cash earnings.
 */

"use strict";

// import necessary modules
var db = require("../db.js");
var logger = require("../logger/logger.js");
var isAuthenticated = require("../passport/isAuthenticated.js");

module.exports = function(oApp) {

    /**
     * Returns a list of all cash-earnings.
     *
     * @name /cash-earnings
     */
    oApp.get("/daily-cash-earnings", isAuthenticated, function(oReq, oRes) {
        var sSql = "SELECT " +
            "ce_id AS id, " +
            "to_char(ce_date, 'YYYY-MM-DD') AS date, " +
            "ce_amount AS amount, " +
            "ce_description AS description " +
        "FROM cash_earnings;";

        db.query(sSql, function(oErr, oResult) {
            if(oErr) {
                logger.log(logger.levels.ERR, oErr);
                return oRes.status(500).json({
                    "success": false,
                    "err": oErr
                });
            }

            return oRes.status(200).json({
                "success": true,
                "count": oResult.rows.length,
                "data": oResult.rows
            });
        });
    });

    /**
     * Adds a new cash earning.
     *
     * @name /daily-cash-earnings
     * @param earning (in body, obligatory)
     */
    oApp.post("/daily-cash-earnings", isAuthenticated, function(oReq, oRes) {
        var oEarning = oReq.body;
        var sSql = "INSERT INTO cash_earnings (" +
            "ce_date, " +
            "ce_amount, " +
            "ce_description" +
        ") VALUES (" +
            "'" + oEarning.date + "', " +
            "'" + oEarning.amount + "', " +
            "'" + oEarning.description + "'" +
        ") RETURNING " +
            "ce_id AS id, " +
            "to_char(ce_date, 'YYYY-MM-DD') AS date, " +
            "ce_amount AS amount, " +
            "ce_description AS description;";

        db.query(sSql, function(oErr, oResult) {
            if(oErr) {
                logger.log(logger.levels.ERR, oErr);
                return oRes.status(500).json({
                    "success": false,
                    "err": oErr
                });
            }

            return oRes.status(201).json({
                "success": true,
                "data": oResult
            });
        });
    });

    /**
     * Deletes a cash earning by id.
     *
     * @name /daily-cash-earnings/:id
     * @param id (obligatory)
     */
    oApp.delete("/daily-cash-earnings/:id", isAuthenticated, function(oReq, oRes) {
        var sId = oReq.params.id;
        var sSql = "DELETE FROM cash_earnings WHERE ce_id = '" + sId + "';";

        db.query(sSql, function(oErr, oResult) {
            if(oErr) {
                logger.log(logger.levels.ERR, oErr);
                return oRes.status(500).json({
                    "success": false,
                    "err": oErr
                });
            }

            return oRes.status(200).json({
                "success": true
            });
        });
    });
};
