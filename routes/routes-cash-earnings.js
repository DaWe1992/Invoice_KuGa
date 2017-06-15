/**
 * Created by Daniel on 15.06.2017.
 * This file contains all routes concerning the cash earnings.
 */

"use strict";

// Import necessary modules
var db = require("../db.js");

module.exports = function(app) {

    /**
     * Returns a list of all cash-earnings.
     * @name /cash-earnings
     */
    app.get("/daily-cash-earnings", function(req, res) {
        var sql = "SELECT ce_id AS id, ce_date AS date, ce_amount AS amount, ce_description AS description " +
                  "FROM cash_earnings;";

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
