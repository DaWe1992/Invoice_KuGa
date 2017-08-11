/**
 * Created by Daniel on 11.08.2016.
 * This file contains all routes concerning the statistics.
 */

"use strict";

// import necessary modules
var db = require("../db.js");
var url = require("url");
var logger = require("../logger/logger.js");
var isAuthenticated = require("../passport/isAuthenticated.js");

module.exports = function(oApp) {

    /**
     * Returns the event revenues grouped by month.
     *
     * @name /statistics/evtrevbymonth
     */
    oApp.get("/statistics/evt-rev-by-month", isAuthenticated, function(oReq, oRes) {
        var sSql = "";
    });

    /**
     * Returns the event revenues grouped by customers.
     *
     * @name /statistics/evtrevbycustomer
     * @param gross (if true, gross prices are returned, else net prices)
     * @param limit (limits the number of result rows)
     */
    oApp.get("/statistics/evt-rev-by-customer", isAuthenticated, function(oReq, oRes) {
        var oQueryObject = url.parse(oReq.url, true).query;

        var sGross = oQueryObject.gross === "true" ? "true" : "false";
        var sLimit = !isNaN(oQueryObject.limit) ? oQueryObject.limit : "10";

        var sSqlGross = gross === "true" ? " * (1 + ipos_vat)" : "";
        var sSqlLimit = " LIMIT " + limit;

        // get revenues by customer
        var sSql = "SELECT " +
            "customers.cust_id AS id, " +
            "customers.cust_firstname AS firstname, " +
            "customers.cust_lastname AS lastname, " +
            "ROUND(SUM(invoice_positions.ipos_net_price * invoice_positions.ipos_qty" + sSqlGross + ")::numeric, 2) AS evtrevenue " +
        "FROM ( " +
            "invoices INNER JOIN customers ON invoices.inv_cust_id = customers.cust_id" +
        ") INNER JOIN invoice_positions ON invoice_positions.ipos_inv_id = invoices.inv_id " +
        "GROUP BY customers.cust_id " +
        "ORDER BY evtrevenue DESC" + sSqlLimit + ";";

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
                "params": {
                    "gross": sGross,
                    "limit": sLimit
                },
                "data": oResult.rows
            });
        });
    });

    /**
     * Returns the cash earnings revenues.
     *
     * @name /statistics/ce-rev
     */
    oApp.get("/statistics/ce-rev", isAuthenticated, function(oReq, oRes) {
        var sSql = "SELECT " +
            "ce_amount AS cerevenue, " +
            "to_char(ce_date, 'YYYY-MM-DD') AS date " +
        "FROM cash_earnings " +
        "ORDER BY date DESC;";

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
                "data": oResult.rows
            });
        });
    });
};
