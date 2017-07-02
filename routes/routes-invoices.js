/**
 * Created by Daniel on 11.08.2016.
 * This file contains all routes concerning the invoices.
 */

"use strict";

// Import necessary modules
var db = require("../db.js");
var fs = require("fs");
var pdf = require("html-pdf");
var mustache = require("mustache");

// Options for pdf creation
var pdf_options = {
    "format": "A4"
    //"orientation": "landscape"
    // for further options, see: https://www.npmjs.com/package/html-pdf
};

module.exports = function(app) {

    /**
     * Returns a list of all invoices.
     * @name /invoices
     */
    app.get("/invoices", function(req, res) {

        // Get a list of all invoices including their gross amounts
        var sql = "SELECT inv_id AS id, to_char(inv_date, 'YYYY-MM-DD') AS date, inv_description AS description, (" +
                      "SELECT SUM((ipos_qty * ipos_net_price) * (1 + ipos_vat)) " +
                      "FROM invoice_positions WHERE ipos_inv_id = inv_id" +
                  "), cust_address AS custaddress, cust_firstname AS custfirstname, cust_lastname AS custlastname, " +
                  "cust_street AS custstreet, cust_zip AS custzip, cust_city AS custcity " +
                  "FROM invoices INNER JOIN customers ON invoices.inv_cust_id = customers.cust_id " +
                  "ORDER BY custlastname;";

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
     * Returns the invoice with the id specified.
     * @name /invoices/:id
     * @param id (obligatory)
     */
    app.get("/invoices/:id", function(req, res) {
        var id = req.params.id;

        // Get the invoice data
        getInvoiceById(id, function(data, err) {
            if(err) {
                return res.status(500).json({
                    "success": false,
                    "err": err
                });
            }

            return res.status(200).json({
                "success": true,
                "data": data
            });
        });
    });

    /**
     * Prints a pdf document for the invoice specified.
     * @name /invoices/:id/print
     * @param id (obligatory)
     */
    app.get("/invoices/:id/print", function(req, res) {
        var id = req.params.id;

        // Get the invoice data
        getInvoiceById(id, function(data, err) {
            if(err) {
                return res.status(500).json({
                    "success": false,
                    "err": err
                });
            }

            readAndRenderTemplate(data, function(html) {

                // Create pdf and pipe it to the response stream
                pdf.create(html, pdf_options).toStream(function(err, stream) {
                    res.setHeader("Content-type", "application/pdf");
                    res.setHeader("Content-disposition", "attachment; filename=Rechnung_" + data.invoice.id + ".pdf");
                    stream.pipe(res);
                });
            });
        });
    });

    /**
     * Gets all positions for the invoice specified.
     * @name /invoices/:id/positions
     * @param id (obligatory)
     */
    app.get("/invoices/:id/positions", function(req, res) {

    });

    /**
     * Adds a new position for the invoice specified.
     * @name /invoices/:id/positions
     * @param id (obligatory)
     */
    app.post("/invoices/:id/positions", function(req, res) {
        var id = req.params.id;
        var item = req.body;
        var sql = "INSERT INTO invoice_positions (ipos_inv_id, ipos_description, ipos_qty, ipos_net_price, ipos_vat) " +
                  "VALUES ('" + id + "', '" + item.pos + "', '" + item.qty + "', '" + item.unitprice + "', '" + item.vatrate + "');";

        db.query(sql, function(err, result) {
            if(err) {
                return res.status(500).json({
                    "success": false,
                    "err": err
                });
            }

            return res.status(200).json({
                "success": true,
                "data": data
            });
        });
    });
};

/**
 * Gets the data for the
 * invoice specified.
 * @param id
 * @param callback
 */
function getInvoiceById(id, callback) {
    // Initialize empty object
    var data = {};

    // Load customer data
    var sql = "SELECT customers.cust_address AS address, customers.cust_firstname AS firstname, customers.cust_lastname AS lastname, " +
                  "customers.cust_street AS street, customers.cust_zip AS zip, customers.cust_city AS city " +
              "FROM customers INNER JOIN invoices ON customers.cust_id = invoices.inv_cust_id " +
              "WHERE invoices.inv_id = '" + id + "';"

    db.query(sql, function(err, result) {
        if(err) callback(null, err);
        data.customer = result.rows[0];

        // Load invoice data
        sql = "SELECT inv_id AS id, to_char(inv_date, 'DD.MM.YYYY') AS date FROM invoices WHERE inv_id = '" + id + "';";

        db.query(sql, function(err, result) {
            if(err) callback(null, err);
            data.invoice = result.rows[0];

            // Load invoice positions
            sql = "SELECT ipos_description AS pos, ipos_qty AS qty, ipos_net_price AS unitprice, " +
                      "ROUND((ipos_qty * ipos_net_price)::numeric,2) AS net, ipos_vat AS vatrate, ROUND(((ipos_qty * ipos_net_price) * ipos_vat)::numeric,2) AS vat, " +
                      "ROUND(((ipos_qty * ipos_net_price) + ((ipos_qty * ipos_net_price) * ipos_vat))::numeric,2) AS gross " +
                  "FROM invoice_positions " +
                  "WHERE ipos_inv_id = '" + id + "';";

            db.query(sql, function(err, result) {
                if(err) callback(null, err)
                data.invoice.positions = result.rows;

                // Calculate the sums
                getSums(data.invoice.positions, function(sums) {
                    data.invoice.sums = sums;
                    callback(data, null);
                });
            });
        });
    });
}

/**
 * Calculates the sums of the invoice.
 * @param positions
 * @param callback
 */
function getSums(positions, callback) {
    var sumNet = 0;
    var sumVat1 = 0; // 7%
    var sumVat2 = 0; // 19%
    var sumGross = 0;

    // loop over positions
    positions.forEach(function(pos) {
        sumNet += Number(pos.net);
        sumGross += Number(pos.gross);
        sumVat1 += (pos.vatrate === "0.07" ? Number(pos.vat) : 0);
        sumVat2 += (pos.vatrate === "0.19" ? Number(pos.vat) : 0);
    });

    callback({
        net: sumNet.toFixed(2),
        gross: sumGross.toFixed(2),
        vat1: sumVat1.toFixed(2),
        vat2: sumVat2.toFixed(2)
    });
}

/**
 * Reads and renders an HTML template
 * with the data specified.
 * @param data
 * @param callback
 */
function readAndRenderTemplate(data, callback) {
    // Read template
    fs.readFile("./template/invoice.html", "utf-8", function(err, template) {
        var html;
        var path;

        // Render template with data
        mustache.parse(template);
        html = mustache.render(template, data);

        callback(html);
    });
}
