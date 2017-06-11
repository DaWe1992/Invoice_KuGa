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
     * Returns the revenues grouped by month.
     * @name /statistics/revbymonth
     */
    app.get("/statistics/revbymonth", function(req, res) {

        var sql = "";

    });

    /**
     * Returns the revenues grouped by customers.
     * @name /statistics/revbycustomer
     * @param gross (if true, gross prices are returned, else net prices)
     * @param limit (limits the number of result rows)
     */
    app.get("/statistics/revbycustomer", function(req, res) {

        var queryObject = url.parse(req.url,true).query;

        var gross = queryObject.gross === "true" ? " * (1 + ipos_vat)" : "";
        var limit = !isNaN(queryObject.limit) ? " LIMIT " + queryObject.limit : " LIMIT 10";

        // Get revenues by customer
        var sql = "SELECT customers.cust_id, customers.cust_firstname, customers.cust_lastname, " +
                      "ROUND(SUM(invoice_positions.ipos_net_price * invoice_positions.ipos_qty" + gross + ")::numeric,2) AS revenue " +
                  "FROM ( " +
                      "invoices INNER JOIN customers " +
                      "ON invoices.inv_cust_id = customers.cust_id" +
                  ") INNER JOIN invoice_positions " +
                      "ON invoice_positions.ipos_inv_id = invoices.inv_id " +
                  "GROUP BY customers.cust_id " +
                  "ORDER BY revenue DESC" + limit + ";";

        db.query(sql, function(err, result) {
            if(err) {
                return res.status(500).json({
                    "success": false,
                    "err": err
                });
            }

            return res.status(200).json({
                "success": true,
                "gross": queryObject.gross ? true : false,
                "data": result.rows
            });
        });
    });
};
