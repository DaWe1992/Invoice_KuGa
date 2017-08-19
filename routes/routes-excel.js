/**
 * Created by Daniel on 14.08.2017.
 * This file contains all routes concerning the excel statistics.
 */

"use strict";

// import necessary modules
var fs = require("fs");
var postgresDb = require("../postgres/postgres.js");
var async = require("async");
var xlsBuilder = require("msexcel-builder-colorfix");
var logger = require("../logger/logger.js");
var isAuthenticated = require("../passport/isAuthenticated.js");

module.exports = function(oApp) {

    /**
     * Gets the aggregated revenues and sends an excel file.
     *
     * @name /statistics/aggregated-revenues/:year
     * @param year (obligatory)
     */
    oApp.get("/statistics/aggregated-revenues/:year", isAuthenticated, function(oReq, oRes) {
        var sYear = oReq.params.year;
        var sFilePath = "./xlsx/";
        var sFileName = "aggregated_revenues" + sYear + ".xlsx";
        var sFullFilePath = sFilePath + sFileName;

        // create workbook
        var oWorkBook = xlsBuilder.createWorkbook(
            sFilePath, sFileName
        );
        var oSheet = prepareExcelSheet(oWorkBook, "Nettoumsätze", sYear);

        // add data to sheet
        async.each(getSequence(1, 12), function(i, fCallback) {
            getAggregatedRevenues(i, sYear, function(oRes) {
                var i = oRes.month;

                addMissingRevenueEntries(oRes.data, function(aData) {
                    for(var j = 0; j < aData.length; j++) {
                        oSheet.align(i + 1, j + 4, "right");
                        oSheet.border(i + 1, j + 4, {
                            left: "thin",
                            top: "thin",
                            right: "thin",
                            bottom: "thin"
                        });
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
                    // read excel file created from fs
                    var oReadStream = fs.createReadStream(sFullFilePath);
                    var oStats = fs.statSync(sFullFilePath);

                    // set http headers
                    oRes.setHeader(
                        "Content-type",
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    );
                    oRes.setHeader("Content-length", oStats.size);
                    oRes.setHeader("Content-disposition", "attachment; filename=" + sFileName);

                    // pipe file stream to response
                    oReadStream.pipe(oRes);
                }
            });
        });
    });
};

/**
 * Prepares the excel sheet.
 *
 * @param oWorkBook
 * @param sSheetName
 * @param sYear
 * @return
 */
function prepareExcelSheet(oWorkBook, sSheetName, sYear) {
    // create worksheet
    var oSheet = oWorkBook.createSheet(sSheetName, 400, 400);
    // add header
    oSheet.font(1, 1, {
        sz: "18",
        bold: "true"
    });
    oSheet.set(1, 1, sSheetName);

    formatCell(
        oSheet, 1, 3, "13", "true",
        "3F5161", "center", true
    );
    oSheet.set(1, 3, sYear);

    // set days
    for(var i = 0; i < 31; i++) {
        formatCell(
            oSheet, 1, i + 4, "13", "true",
            "427CAC", "center", true
        );
        oSheet.set(1, i + 4, i + 1);
    }

    // set months
    for(var i = 0; i < 12; i++) {
        formatCell(
            oSheet, i + 2, 3, "13", "true",
            "427CAC", "center", true
        );
        oSheet.set(i + 2, 3, i + 1);
    }

    return oSheet;
}

/**
 * Formats excel cell.
 *
 * @param oSheet
 * @param iCol
 * @param iRow
 * @param sSize
 * @param sBold
 * @param sColor
 * @param sAlign
 * @param bBorders
 */
function formatCell(oSheet, iCol, iRow, sSize, sBold, sColor, sAlign, bBorders) {
    oSheet.font(iCol, iRow, {
        sz: sSize,
        bold: sBold
    });
    oSheet.align(iCol, iRow, sAlign);
    oSheet.fill(iCol, iRow, {
        type: "solid",
        fgColor: sColor
    });

    if(bBorders) {
        oSheet.border(iCol, iRow, {
            left: "thin",
            top: "thin",
            right: "thin",
            bottom: "thin"
        });
    }
}

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
function addMissingRevenueEntries(aArr, fCallback) {
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

    postgresDb.query(sSql, function(oErr, oResult) {
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
