/**
 * Created by Daniel on 28.07.2016.
 * This file contains all routes concerning the customers.
 */

"use strict";

// Import necessary modules
var db = require("../db.js");

module.exports = function(app) {

    /**
     * Returns a list of all customers.
     * @name /customers
     */
    app.get("/customers", function(req, res) {
        var sql = "SELECT cust_id AS id, cust_address AS address, " +
        "cust_firstname AS firstname, cust_lastname AS lastname FROM customers;";

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
     * Returns the details for a specific customer.
     * @name /customer/:id
     * @param id (obligatory)
     */
    app.get("/customers/:id", function(req, res) {
        var id = req.params.id;
        var response = {};

        var sql = "SELECT cust_id AS id, cust_address AS address, " +
        "cust_firstname AS firstname, cust_lastname AS lastname, cust_street AS street, " +
        "cust_zip AS zip, cust_city AS city FROM customers WHERE cust_id = '" + id + "';";

        db.query(sql, function(err, result) {
            if(err) {
                return res.status(500).json({
                    "success": false,
                    "err": err
                });
            }

            response.customer = result.rows[0];
            sql = "SELECT cuco_contact_type AS type, " +
            "cuco_contact AS data, cuco_comments AS comments " +
            "FROM customer_contacts WHERE cuco_customer = '" + id + "';";

            db.query(sql, function(err, result) {
                if(err) {
                    return res.status(500).json({
                        "success": false,
                        "err": err
                    });
                }

                response.contacts = result.rows;
                return res.status(200).json({
                    "success": true,
                    "data": response
                });
            });
        });
    });

    /**
     * Checks if a customer record is locked.
     * @name /customers/:id/islocked
     * @param id (obligatory)
     */
    app.get("/customers/:id/islocked", function(req, res) {
        var id = req.params.id;
        var response;

        var sql = "SELECT culo_id AS id, culo_user_email AS email, culo_user_name AS user " +
        "FROM customers_lock WHERE culo_id = '" + id + "';";

        db.query(sql, function(err, result) {
            if(err) {
                return res.status(500).json({
                    "success": false,
                    "err": err
                });
            }

            response = ((result.rows.length > 0)
                ? result.rows[0]
                : false
            );

            return res.status(200).json({
                "success": true,
                "data": response
            });
        });
    });

    /**
     * Locks a customer record.
     * @name /customers/id/lock
     * @param id (obligatory)
     */
    app.post("/customers/:id/lock", function(req, res) {
        var id = req.params.id;
        var sql = "INSERT INTO customers_lock (culo_id, culo_user_email, culo_user_name) VALUES ('"
        + id + "', '" + res.locals.user.email + "', '" + res.locals.user.fullName + "');";

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

    /**
     * Unlocks a customer record.
     * @name /customers/id/unlock
     * @param id (obligatory)
     */
    app.post("/customers/:id/unlock", function(req, res) {
        var id = req.params.id;
        var sql = "DELETE FROM customers_lock WHERE culo_id = '" + id + "';";

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
