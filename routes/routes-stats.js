/**
 * Created by Daniel on 11.08.2016.
 * This file contains all routes concerning the statistics.
 */

"use strict";

// Import necessary modules
var db = require("../db.js");
var url = require("url");

module.exports = function(app) {

    /**
     * Returns the event revenues grouped by month.
     * @name /statistics/evtrevbymonth
     */
    app.get("/statistics/evt-rev-by-month", function(req, res) {

        var sql = "";

    });

    /**
     * Returns the event revenues grouped by customers.
     * @name /statistics/evtrevbycustomer
     * @param gross (if true, gross prices are returned, else net prices)
     * @param limit (limits the number of result rows)
     */
    app.get("/statistics/evt-rev-by-customer", function(req, res) {

        var queryObject = url.parse(req.url,true).query;

        var gross = queryObject.gross === "true" ? "true" : "false";
        var limit = !isNaN(queryObject.limit) ? queryObject.limit : "10";

        var sqlGross = gross === "true" ? " * (1 + ipos_vat)" : "";
        var sqlLimit = " LIMIT " + limit;

        // Get revenues by customer
        var sql = "SELECT customers.cust_id, customers.cust_firstname, customers.cust_lastname, " +
                      "ROUND(SUM(invoice_positions.ipos_net_price * invoice_positions.ipos_qty" + sqlGross + ")::numeric,2) AS evtrevenue " +
                  "FROM ( " +
                      "invoices INNER JOIN customers " +
                      "ON invoices.inv_cust_id = customers.cust_id" +
                  ") INNER JOIN invoice_positions " +
                      "ON invoice_positions.ipos_inv_id = invoices.inv_id " +
                  "GROUP BY customers.cust_id " +
                  "ORDER BY evtrevenue DESC" + sqlLimit + ";";

        db.query(sql, function(err, result) {
            if(err) {
                return res.status(500).json({
                    "success": false,
                    "err": err
                });
            }

            return res.status(200).json({
                "success": true,
                "params": {
                    "gross": gross,
                    "limit": limit
                },
                "data": result.rows
            });
        });
    });

    /**
     * Returns the cash earnings revenues.
     * @name /statistics/ce-rev
     */
    app.get("/statistics/ce-rev", function(req ,res) {
        var sql = "SELECT ce_amount AS cerevenue, ce_date AS date FROM cash_earnings " +
                  "ORDER BY date DESC;";

        db.query(sql, function(err, result) {
            if(err) {
                return res.status(500).json({
                    "success": false,
                    "err": err
                });
            }

            return res.status(200).json({
                "success": true,
                "data": result.rows
            });
        });
    });
};
