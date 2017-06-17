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
                "count": result.rows.length,
                "data": result.rows
            });
        });
    });

    /**
     * Adds a new cash earning.
     * @name /daily-cash-earnings
     */
    app.post("/daily-cash-earnings", function(req, res) {
        var item = req.body;
        var sql = "INSERT INTO cash_earnings (ce_date, ce_amount, ce_description) " +
                  "VALUES ('" + item.date + "', '" + item.amount + "', '" + item.description + "')" +
                  "RETURNING ce_id AS id, ce_date AS date, ce_amount AS amount, ce_description AS description;";

        db.query(sql, function(err, result) {
            if(err) {
                return res.status(500).json({
                    "success": false,
                    "err": err
                });
            }

            return res.status(200).json({
                "success": true,
                "data": result
            });
        });
    });

    /**
     * Deletes a cash earning by id.
     * @name /daily-cash-earnings/:id
     * @param id (obligatory)
     */
    app.delete("/daily-cash-earnings/:id", function(req, res) {
        var id = req.params.id;
        var sql = "DELETE FROM cash_earnings WHERE ce_id = '" + id + "';";

        db.query(sql, function(err, result) {
            if(err) {
                return res.status(500).json({
                    "success": false,
                    "err": err
                });
            }

            return res.status(200).json({
                "success": true
            });
        });
    });
};
