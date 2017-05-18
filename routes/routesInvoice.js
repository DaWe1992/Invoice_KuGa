/**
 * Created by Daniel on 11.08.2016.
 * This file contains all routes concerning the invoices.
 */

"use strict";

//import necessary modules
var db = require("../db.js");

module.exports = function(app) {

  app.get("/invoices", function(req, res) {

      // get a list of all invoices including their gross amounts
      var sql = "SELECT inv_id, inv_cust_id, inv_date, (" +
                    "SELECT SUM((ipos_qty * ipos_net_price) * (1 + ipos_vat)) " +
                    "FROM invoice_positions WHERE ipos_inv_id = inv_id) " +
                "FROM invoices;";

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
