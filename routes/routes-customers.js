/**
 * Created by Daniel on 28.07.2016.
 * This file contains all routes concerning the customers.
 */

"use strict";

// import necessary modules
var db = require("../db.js");
var logger = require("../logger/logger.js");
var isAuthenticated = require("../passport/isAuthenticated.js");

module.exports = function(oApp) {

    /**
     * Returns a list of all customers.
     *
     * @name /customers
     */
    oApp.get("/customers", isAuthenticated, function(oReq, oRes) {
        var sSql = "SELECT " +
            "cust_id AS id, " +
            "cust_address AS address, " +
            "cust_firstname AS firstname, " +
            "cust_lastname AS lastname " +
        "FROM customers;";

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
     * Adds a new customer to the db.
     *
     * @name /customers
     * @param customer (in body, obligatory)
     */
    oApp.post("/customers", isAuthenticated, function(oReq, oRes) {
        var oCustomer = oReq.body;

        // validate the data received
        if(!validate(oCustomer)) {
            return oRes.status(400).json({
                "success": false,
                "err": "Please fill in all mandatory fields!"
            });
        }

        // generate new customer id
        getNewCustomerId(oCustomer.zip, function(sCustomerId) {
            var sSql = "INSERT INTO customers (" +
                "cust_id, " +
                "cust_address, " +
                "cust_firstname, " +
                "cust_lastname, " +
                "cust_street, " +
                "cust_zip, " +
                "cust_city, " +
                "created_by, " +
                "created_at" +
            ") VALUES (" +
                "'" + sCustomerId + "', " +
                "'" + oCustomer.address + "', " +
                "'" + oCustomer.firstname + "', " +
                "'" + oCustomer.lastname + "', " +
                "'" + oCustomer.street + "', " +
                "'" + oCustomer.zip + "', " +
                "'" + oCustomer.city + "', " +
                "'" + oReq.user.username + "', " +
                "current_date" +
            ");";

            db.query(sSql, function(oErr, oResult) {
                if(oErr) {
                    logger.log(logger.levels.ERR, oErr);
                    return oRes.status(500).json({
                        "success": false,
                        "err": oErr
                    });
                }

                // check if contact were provided
                if(oCustomer.contacts) {
                    // contact were provided
                    // add customer contacts
                    sSql = "INSERT INTO customer_contacts (" +
                        "cuco_customer, " +
                        "cuco_contact_type, " +
                        "cuco_contact, " +
                        "cuco_comments" +
                    ") VALUES";

                    for(var i = 0; i < oCustomer.contacts.length; i++) {
                        sSql += " (" +
                            "'" + sCustomerId + "', " +
                            "'" + oCustomer.contacts[i].type + "', " +
                            "'" + oCustomer.contacts[i].data + "', " +
                            "'" + oCustomer.contacts[i].comments + "'" +
                        "),";
                    }

                    // remove last comma
                    sSql = sSql.substring(0, sSql.length - 1);
                    sSql += ";";

                    // save customer contacts in database
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
                            "data": {
                                "id": sCustomerId
                            }
                        });
                    });
                } else {
                    // contacts were not provided
                    return oRes.status(201).json({
                        "success": true,
                        "data": {
                            "id": sCustomerId
                        }
                    });
                }
            });
        });
    });

    /**
     * Returns the details for a specific customer.
     *
     * @name /customer/:id
     * @param id (obligatory)
     */
    oApp.get("/customers/:id", isAuthenticated, function(oReq, oRes) {
        var sId = oReq.params.id;
        var oResponse = {};

        // select customer data
        var sSql = "SELECT " +
            "cust_id AS id, " +
            "cust_address AS address, " +
            "cust_firstname AS firstname, " +
            "cust_lastname AS lastname, " +
            "cust_street AS street, " +
            "cust_zip AS zip, " +
            "cust_city AS city " +
        "FROM customers " +
        "WHERE cust_id = '" + sId + "';";

        db.query(sSql, function(oErr, oResult) {
            if(oErr) {
                logger.log(logger.levels.ERR, oErr);
                return oRes.status(500).json({
                    "success": false,
                    "err": oErr
                });
            }

            oResponse.customer = oResult.rows[0];

            // load technical information
            sSql = "SELECT " +
                "created_at AS createdat, " +
                "created_by AS createdby, " +
                "updated_at AS updatedat, " +
                "updated_by AS updatedby " +
            "FROM customers " +
            "WHERE cust_id = '" + sId + "';";

            db.query(sSql, function(oErr, oResult) {
                if(oErr) {
                    logger.log(logger.levels.ERR, oErr);
                    return oRes.status(500).json({
                        "success": false,
                        "err": oErr
                    });
                }

                oResponse.techinfo = oResult.rows[0];

                // select customer contacts
                sSql = "SELECT " +
                    "cuco_contact_type AS type, " +
                    "cuco_contact AS data, " +
                    "cuco_comments AS comments " +
                "FROM customer_contacts " +
                "WHERE cuco_customer = '" + sId + "';";

                db.query(sSql, function(oErr, oResult) {
                    if(oErr) {
                        logger.log(logger.levels.ERR, oErr);
                        return oRes.status(500).json({
                            "success": false,
                            "err": oErr
                        });
                    }

                    oResponse.contacts = oResult.rows;
                    return oRes.status(200).json({
                        "success": true,
                        "data": oResponse
                    });
                });
            });
        });
    });

    /**
     * Checks if a customer record is locked.
     *
     * @name /customers/:id/islocked
     * @param id (obligatory)
     */
    oApp.get("/customers/:id/islocked", isAuthenticated, function(oReq, oRes) {
        var sId = oReq.params.id;
        var bResponse;

        var sSql = "SELECT " +
            "culo_id AS id, " +
            "culo_user_email AS email, " +
            "culo_user_name AS user " +
        "FROM customers_lock " +
        "WHERE culo_id = '" + sId + "';";

        db.query(sSql, function(oErr, oResult) {
            if(oErr) {
                logger.log(logger.levels.ERR, oErr);
                return oRes.status(500).json({
                    "success": false,
                    "err": oErr
                });
            }

            bResponse = ((oResult.rows.length > 0)
                ? oResult.rows[0]
                : false
            );

            return oRes.status(200).json({
                "success": true,
                "data": bResponse
            });
        });
    });

    /**
     * Locks a customer record.
     *
     * @name /customers/id/lock
     * @param id (obligatory)
     */
    oApp.post("/customers/:id/lock", isAuthenticated, function(oReq, oRes) {
        var sId = oReq.params.id;
        var sSql = "INSERT INTO customers_lock (" +
            "culo_id, " +
            "culo_user_email, " +
            "culo_user_name" +
        ") VALUES (" +
            "'" + id + "'," +
            "'" + res.locals.user.email + "', " +
            "'" + res.locals.user.fullName + "'" +
        ");";

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

    /**
     * Unlocks a customer record.
     *
     * @name /customers/id/unlock
     * @param id (obligatory)
     */
    oApp.post("/customers/:id/unlock", isAuthenticated, function(oReq, oRes) {
        var sId = oReq.params.id;
        var sSql = "DELETE FROM customers_lock WHERE culo_id = '" + sId + "';";

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

/**
 * Generates the id for a new customer.
 *
 * @param sZip
 * @param fCallback
 */
function getNewCustomerId(sZip, fCallback) {
    getCounterValue(function(iCounter, oErr) {
        if(oErr) {
            logger.log(logger.levels.ERR, oErr);
            fCallback(null, oErr);
        }
        fCallback(sZip + iCounter);
    });
}

/**
 * Gets the current counter value.
 *
 * @param fCallback
 */
function getCounterValue(fCallback) {
    var sSql = "SELECT max(" +
        "substring(cust_id from 6 for (length(cust_id) - 5))" +
    ") AS counter FROM customers;";

    db.query(sSql, function(oErr, oResult) {
        if(oErr) {
            logger.log(logger.levels.ERR, oErr);
            fCallback(null, oErr);
        }

        var iCounter = oResult.rows[0].counter;
        fCallback(iCounter ? ++iCounter : 1, null);
    });
}

/**
 * Validates the customer data
 * to be added to the database.
 *
 * @param oCustomer (data to be persisted in the db)
 * @return true | false
 */
function validate(oCustomer) {
    if(!oCustomer.address) return false;
    if(!oCustomer.lastname) return false;
    if(!oCustomer.street) return false;
    if(!oCustomer.zip) return false;
    if(!oCustomer.city) return false;
    return true;
}
