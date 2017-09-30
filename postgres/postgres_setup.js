/**
 * Created by Daniel on 19.08.2017.
 * This file contains the database (postgres) setup of the app.
 */

"use strict";

// import necessary modules
var postgresDb = require("./postgres.js");

module.exports = function() {

    // create table customers
    postgresDb.query("" +
    "CREATE TABLE IF NOT EXISTS customers (" +
        "cust_id VARCHAR(10) PRIMARY KEY, " +
        "cust_address VARCHAR(10), " +
        "cust_firstname VARCHAR(50), " +
        "cust_lastname VARCHAR(50), " +
        "cust_street VARCHAR(50), " +
        "cust_zip VARCHAR(5), " +
        "cust_city VARCHAR(50), " +
        "created_at DATE, " +
        "created_by VARCHAR(50), " +
        "updated_at DATE, " +
        "updated_by VARCHAR(50)" +
    ");", function(oErr, oResult) {
        if(!oErr) {

            // create table customer_contacts
            postgresDb.query("" +
            "CREATE TABLE IF NOT EXISTS customer_contacts (" +
            	"cuco_id serial PRIMARY KEY, " +
            	"cuco_customer VARCHAR(10) REFERENCES customers(cust_id) ON UPDATE CASCADE ON DELETE CASCADE, " +
            	"cuco_contact_type VARCHAR(10), " +
            	"cuco_contact VARCHAR(100), " +
            	"cuco_comments VARCHAR(200), " +
                "created_at DATE, " +
                "created_by VARCHAR(50), " +
                "updated_at DATE, " +
                "updated_by VARCHAR(50)" +
            ");", function(oErr, oResult) {});

            // create table customer_lock
            postgresDb.query("" +
            "CREATE TABLE IF NOT EXISTS customer_lock (" +
            	"culo_id VARCHAR(10) references customers(cust_id) primary key, " +
            	"culo_user_email VARCHAR(100), " +
            	"culo_user_name VARCHAR(50)" +
            ");", function(oErr, oResult) {});

            // create table invoices
            postgresDb.query("" +
            "CREATE TABLE IF NOT EXISTS invoices (" +
                "inv_id VARCHAR(10) PRIMARY KEY, " +
                "inv_cust_id VARCHAR(10) REFERENCES customers(cust_id) ON UPDATE CASCADE ON DELETE CASCADE, " +
                "inv_date DATE, " +
                "inv_delivery_date DATE, " +
                "inv_room VARCHAR(20), " +
                "inv_description VARCHAR(100), " +
                "created_at DATE, " +
                "created_by VARCHAR(50), " +
                "updated_at DATE, " +
                "updated_by VARCHAR(50)" +
            ");", function(oErr, oResult) {
                if(!oErr) {

                    // create table invoice_positions
                    postgresDb.query("" +
                    "CREATE TABLE IF NOT EXISTS invoice_positions (" +
                        "ipos_id SERIAL PRIMARY KEY, " +
                        "ipos_inv_id VARCHAR(10) REFERENCES invoices(inv_id) ON UPDATE CASCADE ON DELETE CASCADE, " +
                        "ipos_description VARCHAR(100), " +
                        "ipos_qty INT, " +
                        "ipos_net_price NUMERIC(10,2), " +
                        "ipos_vat NUMERIC(3,2), " +
                        "created_at DATE, " +
                        "created_by VARCHAR(50), " +
                        "updated_at DATE, " +
                        "updated_by VARCHAR(50)" +
                    ");", function(oErr, oResult) {});

                    // create table invoice_lock
                    postgresDb.query("" +
                    "CREATE TABLE IF NOT EXISTS invoice_lock (" +
                        "inlo_id VARCHAR(10) references invoices(inv_id) primary key, " +
                        "inlo_user_email VARCHAR(100), " +
                        "inlo_user_name VARCHAR(50)" +
                    ");", function(oErr, oResult) {});
                }
            });
        }
    });

    // create table cash_earnings
    postgresDb.query("" +
    "CREATE TABLE IF NOT EXISTS cash_earnings (" +
        "ce_id SERIAL PRIMARY KEY, " +
        "ce_amount NUMERIC(10,2), " +
        "ce_date DATE, " +
        "ce_description VARCHAR(100), " +
        "created_at DATE, " +
        "created_by VARCHAR(50), " +
        "updated_at DATE, " +
        "updated_by VARCHAR(50)" +
    ");", function(oErr, oResult) {});

    // create table logs
    postgresDb.query("" +
    "CREATE TABLE IF NOT EXISTS logs (" +
        "log_id SERIAL PRIMARY KEY, " +
        "log_status VARCHAR(4), " +
        "log_text VARCHAR(500), " +
        "log_date DATE" +
    ");", function(oErr, oResult) {});
};
