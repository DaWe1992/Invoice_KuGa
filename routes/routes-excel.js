/**
 * Created by Daniel on 14.08.2017.
 * This file contains all routes concerning the excel statistics.
 */

"use strict";

// import necessary modules
var db = require("../db.js");
var async = require("async");
var xlsBuilder = require("msexcel-builder");
var logger = require("../logger/logger.js");
var isAuthenticated = require("../passport/isAuthenticated.js");

module.exports = function(oApp) {

    /**
     * Gets the aggregated revenues and sends an excel file.
     *
     * @name /statistics/aggregated-revenues
     */
    oApp.get("/statistics/aggregated-revenues", isAuthenticated, function(oReq, oRes) {

        // create workbook
        var oWorkBook = xlsBuilder.createWorkbook(
            "./xlsx/", "aggregated_revenues.xlsx"
        );
        // create worksheet
        var oSheet = oWorkBook.createSheet("Nettoumsätze", 400, 400);
        // add header
        oSheet.set(1, 1, "Nettoumsätze");

        // set days
        for(var i = 0; i < 31; i++) {
            oSheet.set(1, i + 4, i + 1);
        }

        // set months
        for(var i = 0; i < 12; i++) {
            oSheet.set(i + 2, 3, i + 1);
        }

        // add data to sheet
        async.each(getSequence(1, 12), function(i, fCallback) {
            getAggregatedRevenues(i, "2017", function(oRes) {
                var i = oRes.month;

                fillArray(oRes.data, function(aData) {
                    for(var j = 0; j < aData.length; j++) {
                        oSheet.set(i + 1, j + 4, aData[j].amount);
                    }

                    fCallback();
                });
            });
        }, function(oErr) {
            if(oErr) {
                logger.log(
                    logger.levels.ERR,
                    "Excel workbook could not be fully created."
                );
                return;
            }

            // save workbook
            oWorkBook.save(function(oErr) {
                if(oErr) {
                    oWorkBook.cancel();
                    logger.log(
                        logger.levels.ERR,
                        "Excel workbook could not be saved."
                    );
                    return oRes.sendStatus(500);
                } else {
                    return oRes.sendStatus(200);
                }
            });
        });
    });
};

/**
 * Gets an array of sequential numbers.
 * e. g.: getSequence(1, 5) => [1, 2, 3, 4, 5]
 *
 * @param iStart (start of sequence)
 * @param iEnd (end of sequence)
 * @return
 */
function getSequence(iStart, iEnd) {
    var iCount = iEnd - iStart + 1;
    return Array.from({length: iCount}, (_, i) => iStart + i);
}

/**
 * Adds missing revenue objects.
 *
 * @param aArr
 * @param fCallback
 */
function fillArray(aArr, fCallback) {
    async.each(getSequence(1, 31), function(i, fCallback) {
        // check if an entry for the ith day exists
        var bFound = aArr.filter(function(oItem) {
            return (oItem.day == i);
        }).length == 1;

        // if not found add a default entry
        if(!bFound) {
            aArr.push({
                "day": i,
                "amount": "0.00"
            });
        }
        fCallback();
    }, function(oErr) {
        if(oErr) {
            logger.log(
                logger.levels.ERR,
                "Error in fillArray function."
            );
            return;
        }

        // sort array by day
        aArr.sort(compare);
        fCallback(aArr);
    });
}

/**
 * Compares to revenue objects
 * and sorts them by day.
 *
 * @param a
 * @param b
 * @return
 */
function compare(a, b) {
    if(a.day < b.day) return -1;
    if(a.day > b.day) return 1;
    return 0;
}

/**
 * Get aggregated revenues.
 *
 * @param sMonth
 * @param sYear
 * @param fCallback
 */
function getAggregatedRevenues(sMonth, sYear, fCallback) {
    var sSql = "SELECT " +
        "date, " +
        "EXTRACT(DAY FROM date) AS day, " +
        "SUM(amount) AS amount " +
    "FROM (" +
        "(SELECT " +
            "inv_date AS date, " +
            "(ipos_qty * ipos_net_price) AS amount " +
        "FROM " +
            "invoice_positions INNER JOIN invoices " +
            "ON invoice_positions.ipos_inv_id = invoices.inv_id" +
        ") UNION (" +
        "SELECT " +
            "ce_date AS date, " +
            "ce_amount AS amount " +
        "FROM cash_earnings)" +
    ") AS revenue_aggregation " +
    "WHERE " +
        "EXTRACT(MONTH FROM date) = " + sMonth + " AND " +
        "EXTRACT(YEAR FROM date) = " + sYear + " " +
    "GROUP BY date " +
    "ORDER BY date;";

    db.query(sSql, function(oErr, oResult) {
        if(oErr) {
            logger.log(logger.levels.ERR, oErr);
            fCallback(null, oErr);
            return;
        }

        fCallback({
            "data": oResult.rows,
            "year": sYear,
            "month": sMonth
        }, null);
    });
}
