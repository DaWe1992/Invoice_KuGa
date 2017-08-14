/**
 * Created by Daniel on 14.08.2017.
 * This file contains all routes concerning the excel statistics.
 */

"use strict";

// import necessary modules
var db = require("../db.js");
var xlsBuilder = require("msexcel-builder");
var logger = require("../logger/logger.js");
var isAuthenticated = require("../passport/isAuthenticated.js");

module.exports = function(oApp) {

    /**
     * Test route to test msexcel-builder.
     *
     * @name /test
     */
    oApp.get("/test", function(oReq, oRes) {
        var oWorkBook = xlsBuilder.createWorkbook("./xlsx/", "test.xlsx");
        var oSheet1 = oWorkBook.createSheet("Umsatz", 50, 50);

        oSheet1.set(1, 1, "Umsätze");
        for(var i = 2; i < 5; i++) {
            oSheet1.set(i, 1, "Test" + i);
        }

        oWorkBook.save(function(oErr) {
            if(oErr) {
                oWorkBook.cancel();
                logger.log(logger.levels.ERR, "Excel workbook could not be saved.");
                return oRes.sendStatus(500);
            } else {
                return oRes.sendStatus(200);
            }
        });
    });
}
