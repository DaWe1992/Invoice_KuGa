/**
 * Created by Daniel on 11.08.2016.
 * This file contains all routes concerning the invoices.
 */

"use strict";

// import necessary modules
var fs = require("fs");
var postgresDb = require("../postgres/postgres.js");
var pdf = require("html-pdf");
var mustache = require("mustache");
var logger = require("../logger/logger.js");
var isAuthenticated = require("../passport/isAuthenticated.js");

// options for pdf creation
var oPdfOptions = {
    "format": "A4"
    // for further options, see: https://www.npmjs.com/package/html-pdf
};

module.exports = function(oApp) {

    /**
     * Returns a list of all invoices.
     *
     * @name /invoices
     */
    oApp.get("/invoices", isAuthenticated, function(oReq, oRes) {

        // get a list of all invoices including their gross amounts
        var sSql = "SELECT " +
            "inv_id AS id, " +
            "to_char(inv_date, 'YYYY-MM-DD') AS date, " +
            "inv_description AS description, " +
            "(" +
                "SELECT " +
                    "SUM((ipos_qty * ipos_net_price) * (1 + ipos_vat)) " +
                "FROM invoice_positions " +
                "WHERE ipos_inv_id = inv_id" +
            "), " +
            "cust_address AS custaddress, " +
            "cust_firstname AS custfirstname, " +
            "cust_lastname AS custlastname, " +
            "cust_street AS custstreet, cust_zip AS custzip, cust_city AS custcity " +
        "FROM " +
            "invoices " +
        "INNER JOIN " +
            "customers " +
        "ON invoices.inv_cust_id = customers.cust_id " +
        "ORDER BY custlastname;";

        postgresDb.query(sSql, function(oErr, oResult) {
            if(oErr) {
                logger.log(logger.levels.ERR, oErr);
                return oRes.status(500).json({
                    "success": false,
                    "err": oErr
                });
            }

            // set sum to 0 if sum is undefined
            for(var i = 0; i < oResult.rows.length; i++) {
                if(!oResult.rows[i].sum) oResult.rows[i].sum = 0;
            }

            return oRes.status(200).json({
                "success": true,
                "count": oResult.rows.length,
                "data": oResult.rows
            });
        });
    });

    /**
     * Adds a new invoice to the db.
     *
     * @name /invoices
     * @param invoice (in body, obligatory)
     */
    oApp.post("/invoices", isAuthenticated, function(oReq, oRes) {
        var oInvoice = oReq.body;

        // validate the data received
        if(!validate(oInvoice)) {
            return oRes.status(400).json({
                "success": false,
                "err": "Please fill in all mandatory fields!"
            });
        }

        // generate new invoice id
        getNewInvoiceId(function(sInvoiceId) {
            var sSql = "INSERT INTO invoices (" +
                "inv_id, " +
                "inv_cust_id, " +
                "inv_date, " +
                "inv_delivery_date, " +
                "inv_room, " +
                "inv_description, " +
                "created_by, " +
                "created_at" +
            ") VALUES (" +
                "'" + sInvoiceId + "', " +
                "'" + oInvoice.customer.id + "', " +
                "'" + oInvoice.invoice.date + "', " +
                "'" + (oInvoice.invoice.deliveryDate
                    ? oInvoice.invoice.deliveryDate
                    : oInvoice.invoice.date) + "', " +
                "'" + oInvoice.invoice.room + "', " +
                "'" + oInvoice.invoice.description + "', " +
                "'" + oReq.user.username + "', " +
                "current_date" +
            ");";

            postgresDb.query(sSql, function(oErr, oResult) {
                if(oErr) {
                    logger.log(logger.levels.ERR, oErr);
                    return oRes.status(500).json({
                        "success": false,
                        "err": oErr
                    });
                }

                // check if invoice positions were provided
                if(oInvoice.invoice.positions) {
                    // positions were provided
                    // add invoice positions
                    sSql = "INSERT INTO invoice_positions (" +
                        "ipos_inv_id, " +
                        "ipos_description, " +
                        "ipos_qty, " +
                        "ipos_net_price, " +
                        "ipos_vat, " +
                        "created_by, " +
                        "created_at" +
                    ") VALUES";

                    for(var i = 0; i < oInvoice.invoice.positions.length; i++) {
                        sSql += " (" +
                            "'" + sInvoiceId + "', " +
                            "'" + oInvoice.invoice.positions[i].pos + "', " +
                            "'" + oInvoice.invoice.positions[i].quantity + "', " +
                            "'" + oInvoice.invoice.positions[i].unitprice + "', " +
                            "'" + oInvoice.invoice.positions[i].vatrate + "', " +
                            "'" + oReq.user.username + "', " +
                            "current_date" +
                        "),";
                    }

                    // remove last comma
                    sSql = sSql.substring(0, sSql.length - 1);
                    sSql += ";";

                    // save invoice positions in database
                    postgresDb.query(sSql, function(oErr, oResult) {
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
                                "id": sInvoiceId
                            }
                        });
                    });
                } else {
                    // positions were not provided
                    return oRes.status(201).json({
                        "success": true,
                        "data": {
                            "id": sInvoiceId
                        }
                    });
                }
            });
        });
    });

    /**
     * Returns the invoice with the id specified.
     *
     * @name /invoices/:id
     * @param id (obligatory)
     */
    oApp.get("/invoices/:id", isAuthenticated, function(oReq, oRes) {
        var sId = oReq.params.id;

        // get the invoice data
        getInvoiceById(sId, function(oData, oErr) {
            if(oErr) {
                logger.log(logger.levels.ERR, oErr);
                return oRes.status(500).json({
                    "success": false,
                    "err": oErr
                });
            }

            return oRes.status(200).json({
                "success": true,
                "data": oData
            });
        });
    });

    /**
     * Prints a pdf document for the invoice specified.
     *
     * @name /invoices/:id/print
     * @param id (obligatory)
     */
    oApp.get("/invoices/:id/print", isAuthenticated, function(oReq, oRes) {
        var sId = oReq.params.id;

        // get the invoice data
        getInvoiceById(sId, function(oInvoice, oErr) {
            if(oErr) {
                logger.log(logger.levels.ERR, oErr);
                return oRes.status(500).json({
                    "success": false,
                    "err": oErr
                });
            }

            produceHtmlInvoice(oInvoice, function(sHtml) {
            //readAndRenderTemplate(oInvoice, function(sHtml) {

                // create pdf and pipe it to the response stream
                pdf.create(sHtml, oPdfOptions).toStream(function(oErr, oStream) {
                    oRes.setHeader("Content-type", "application/pdf");
                    oRes.setHeader("Content-disposition", "attachment; filename=Rechnung_" + oInvoice.invoice.id + ".pdf");
                    oStream.pipe(oRes);
                });
            });
        });
    });

    /**
     * Gets all positions for the invoice specified.
     *
     * @name /invoices/:id/positions
     * @param id (obligatory)
     */
    oApp.get("/invoices/:id/positions", isAuthenticated, function(oReq, oRes) {

    });

    /**
     * Adds a new position for the invoice specified.
     *
     * @name /invoices/:id/positions
     * @param id (obligatory)
     */
    oApp.post("/invoices/:id/positions", isAuthenticated, function(oReq, oRes) {
        var sId = oReq.params.id;
        var oPosition = oReq.body;
        var sSql = "INSERT INTO invoice_positions (" +
            "ipos_inv_id, " +
            "ipos_description, " +
            "ipos_qty, " +
            "ipos_net_price, " +
            "ipos_vat" +
        ") VALUES (" +
            "'" + sId + "', " +
            "'" + oPosition.pos + "', " +
            "'" + oPosition.qty + "', " +
            "'" + oPosition.unitprice + "', " +
            "'" + oPosition.vatrate + "');";

        postgresDb.query(sSql, function(oErr, oResult) {
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
 * Gets the data for the
 * invoice specified.
 *
 * @param sId
 * @param fCallback
 */
function getInvoiceById(sId, fCallback) {
    // initialize empty object
    var oResponse = {};

    // load customer data
    var sSql = "SELECT " +
        "customers.cust_id AS id, " +
        "customers.cust_address AS address, " +
        "customers.cust_firstname AS firstname, " +
        "customers.cust_lastname AS lastname, " +
        "customers.cust_street AS street, " +
        "customers.cust_zip AS zip, " +
        "customers.cust_city AS city " +
    "FROM " +
        "customers " +
    "INNER JOIN " +
        "invoices " +
    "ON customers.cust_id = invoices.inv_cust_id " +
    "WHERE invoices.inv_id = '" + sId + "';"

    postgresDb.query(sSql, function(oErr, oResult) {
        if(oErr) {
            logger.log(logger.levels.ERR, oErr);
            fCallback(null, oErr);
        }

        oResponse.customer = oResult.rows[0];

        // load technical information
        sSql = "SELECT " +
            "created_at AS createdat, " +
            "created_by AS createdby, " +
            "updated_at AS updatedat, " +
            "updated_by AS updatedby " +
        "FROM invoices " +
        "WHERE inv_id = '" + sId + "';";

        postgresDb.query(sSql, function(oErr, oResult) {
            if(oErr) {
                logger.log(logger.levels.ERR, oErr);
                return oRes.status(500).json({
                    "success": false,
                    "err": oErr
                });
            }

            oResponse.techinfo = oResult.rows[0];

            // load invoice data
            sSql = "SELECT " +
                "inv_id AS id, " +
                "inv_description AS description, " +
                "to_char(inv_date, 'DD.MM.YYYY') AS date " +
            "FROM invoices " +
            "WHERE inv_id = '" + sId + "';";

            postgresDb.query(sSql, function(oErr, oResult) {
                if(oErr) {
                    logger.log(logger.levels.ERR, oErr);
                    fCallback(null, oErr);
                }

                oResponse.invoice = oResult.rows[0];

                // load invoice positions
                sSql = "SELECT " +
                    "ipos_description AS pos, " +
                    "ipos_qty AS qty, " +
                    "ipos_net_price AS unitprice, " +
                    "ROUND((ipos_qty * ipos_net_price)::numeric, 2) AS net, " +
                    "ipos_vat AS vatrate, " +
                    "ROUND(((ipos_qty * ipos_net_price) * ipos_vat)::numeric, 2) AS vat, " +
                    "ROUND(((ipos_qty * ipos_net_price) + ((ipos_qty * ipos_net_price) * ipos_vat))::numeric, 2) AS gross " +
                "FROM invoice_positions " +
                "WHERE ipos_inv_id = '" + sId + "';";

                postgresDb.query(sSql, function(oErr, oResult) {
                    if(oErr) {
                        logger.log(logger.levels.ERR, oErr);
                        fCallback(null, oErr)
                    }

                    oResponse.invoice.positions = oResult.rows;

                    // calculate the sums
                    getSums(oResponse.invoice.positions, function(oSums) {
                        oResponse.invoice.sums = oSums;
                        fCallback(oResponse, null);
                    });
                });
            });
        });
    });
}

/**
 * Calculates the sums of the invoice.
 *
 * @param aPositions
 * @param fCallback
 */
function getSums(aPositions, fCallback) {
    var dSumNet = 0;
    var dSumVat1 = 0; // 7%
    var dSumVat2 = 0; // 19%
    var dSumGross = 0;

    // loop over positions
    aPositions.forEach(function(oPos) {
        dSumNet += Number(oPos.net);
        dSumGross += Number(oPos.gross);
        dSumVat1 += (oPos.vatrate === "0.07" ? Number(oPos.vat) : 0);
        dSumVat2 += (oPos.vatrate === "0.19" ? Number(oPos.vat) : 0);
    });

    fCallback({
        net: dSumNet.toFixed(2),
        gross: dSumGross.toFixed(2),
        vat1: dSumVat1.toFixed(2),
        vat2: dSumVat2.toFixed(2)
    });
}

/**
 * Reads and renders an HTML template
 * with the data specified.
 *
 * @param oInvoice
 * @param fCallback
 */
function readAndRenderTemplate(oInvoice, fCallback) {
    // read template
    fs.readFile("./template/invoice.html", "utf-8", function(oErr, oTemplate) {
        var sHtml;

        // render template with data
        mustache.parse(oTemplate);
        sHtml = mustache.render(oTemplate, oInvoice);

        fCallback(sHtml);
    });
}

/**
 * Produces the html invoice.
 *
 * @param oData
 * @param fCallback
 */
function produceHtmlInvoice(oData, fCallback) {
    fCallback("" +
    "<!DOCTYPE html>" +
    "<html>" +
        "<head>" +
            "<meta charset='UTF-8'>" +
            "<title></title>" +
            getCss() +
        "</head>" +
        "<body>" +
            "<div id='invoice'>" +
                getHtmlInvoiceHeader(oData) +
                getHtmlInvoiceFooter() +
                getHtmlInvoicePositions(oData) +
            "</div>" +
        "</body>" +
    "</html>");
}

/**
 * Styling for the invoice.
 *
 * @return
 */
function getCss() {
    return "" +
    "<style type='text/css'>" +
        "body {font-family: Verdana;font-size: 0.55em;}" +
        "table {width: 87.5%;}" +
        "#invoice {margin-left: 10%;}" +
        "#invoice-header-recipient {margin-top: 20%;margin-bottom: 30%;}" +
        "#invoice-header-line table {border-bottom: 1.5px solid #000;}" +
        "#invoice-header-line table th {text-align: left;}" +
        "#invoice-header-line table td {width: 45%;}" +
        "#invoice-header-text {margin-top: 5%;}" +
        "#invoice-header-text table {margin-top: 5%;margin-bottom: 5%;border: 1px solid #000;}" +
        "#invoice-positions .positions-table {margin-top: 10%;margin-bottom: 30%;border-top: 1px solid #000;border-bottom: 1px solid #000;}" +
        "#invoice-positions .positions-table #last td {border-bottom: 1px solid #000;}" +
        "#invoice-positions .positions-table th {text-align: center !important;padding: 3px;border-bottom: 1px solid #000}" +
        "#invoice-positions .positions-table tr:nth-child(even) {background-color: #eee}" +
        "#invoice-positions .positions-table td {text-align: left;padding: 3px;}" +
        ".text-right {text-align: right !important;}" +
        "#invoice-footer {margin-bottom: 100%;}" +
        ".page-header {border-bottom: 1px solid #000;}" +
    "</style>";
}

/**
 * Gets the html invoice header.
 *
 * @param oData
 * @return
 */
function getHtmlInvoiceHeader(oData) {
    var sHtml = "" +
    "<div id='invoice-header'>" +
        "<div id='invoice-header-recipient'>" +
            "<p>" +
                oData.customer.address + "<br>" +
                oData.customer.firstname + " " + oData.customer.lastname + "<br>" +
                oData.customer.street + "<br>" +
                oData.customer.zip + " " + oData.customer.city +
            "</p>" +
        "</div>" +
        "<div id='invoice-header-line'>" +
            "<table>" +
                "<thead>" +
                    "<tr>" +
                        "<th>Rechnungs-Nr.:</th>" +
                        "<th></th>" +
                        "<th>Datum:</th>" +
                    "</tr>" +
                "</thead>" +
                "<tbody>" +
                    "<tr>" +
                        "<td><b>" + oData.invoice.id + "</b></td>" +
                        "<td></td>" +
                        "<td>" + oData.invoice.date + "</td>" +
                    "</tr>" +
                "</tbody>" +
            "</table>" +
        "</div>" +
        "<div id='invoice-header-text'>";
            if(oData.customer.address === "Herr") {sHtml += "<p>Sehr geehrter ";}
            else {sHtml += "<p>Sehr geehrte ";}
            sHtml += oData.customer.address + " " + oData.customer.lastname + ",</p>" +
            "<p>für unsere Leistungen erlauben wir uns,<br>Ihnen folgenden Betrag in Rechnung zu stellen:</p>" +
            "<table id='sums'>" +
                "<thead>" +
                    "<tr>" +
                        "<td>Netto</td>" +
                        "<td>MwSt 7 %</td>" +
                        "<td>MwSt 19 %</td>" +
                        "<td>Brutto</td>" +
                    "</tr>" +
                "</thead>" +
                "<tbody>" +
                    "<tr>" +
                        "<td><b>" + oData.invoice.sums.net + "</b></td>" +
                        "<td><b>" + oData.invoice.sums.vat1 + "</b></td>" +
                        "<td><b>" + oData.invoice.sums.vat2 + "</b></td>" +
                        "<td><b>" + oData.invoice.sums.gross + "</b></td>" +
                    "</tr>" +
                    "<tr>" +
                        "<td colspan='4'><small><em>Eine detaillierte Aufstellung kann den Folgeseiten entnommen werden.</em></small></td>" +
                    "</tr>" +
                "</tbody>" +
            "</table>" +
            "<table>" +
                "<tbody>" +
                    "<tr>" +
                        "<td><b>Leistungsdatum:</b></td>" +
                        "<td>" + oData.invoice.timeOfDelivery + "</td>" +
                    "</tr>" +
                    "<tr>" +
                        "<td><b>Leistungsort:</b></td>" +
                        "<td>" + oData.invoice.room + "</td>" +
                    "</tr>" +
                "</tbody>" +
            "</table>" +
        "</div>" +
    "</div>";
    return sHtml;
}

/**
 * Gets the html invoice positions.
 *
 * @param oData
 * @return
 */
function getHtmlInvoicePositions(oData) {
    var iPosCount = oData.invoice.positions.length;
    var iPageCount = 2;
    var iPosPerPage = 35;
    var iMaxPageCount = Math.ceil(iPosCount / iPosPerPage) + 1;

    var sHtml = "<div id='invoice-positions'>";

    for(var i = 0; i < iPosCount; i++) {

        // start a new table on a new page after 35 positions
        if(i % iPosPerPage === 0) {
            if(i !== 0) {sHtml += "</tbody></table>";}
            sHtml += "" +
            "<br><table class='page-header'>" +
                "<tr>" +
                    "<td><small>Rechnungsnummer: <b>" + oData.invoice.id + "</b></small></td>" +
                    "<td><small>Rechnungsdatum: " + oData.invoice.timeOfDelivery + "</small></td>" +
                    "<td class='text-right'><small>Seite " + (iPageCount++) +
                    "/" + iMaxPageCount + "</small></td>" +
                "</tr>" +
            "</table>" +
            "<table class='positions-table'>" + getHtmlInvoicePositionsTableHeader() + "<tbody>";
        }

        // add id 'last' if the last position has been reached
        if(i === iPosCount - 1) {sHtml += "<tr id='last'>";}
        else {sHtml += "<tr>";}

        // add i-th position
        sHtml += "" +
            "<td class='text-right'>" + oData.invoice.positions[i].qty + "</td>" +
            "<td>" + oData.invoice.positions[i].pos + "</td>" +
            "<td class='text-right'>" + oData.invoice.positions[i].unitprice + "</td>" +
            "<td class='text-right'>" + oData.invoice.positions[i].net + "</td>" +
            "<td class='text-right'>" + oData.invoice.positions[i].vat + "</td>" +
            "<td class='text-right'>" + oData.invoice.positions[i].gross + "</td>" +
        "</tr>";
    }

    // add sum row
    sHtml += "<tr>" +
                "<td><b>Summe</b></td>" +
                "<td></td>" +
                "<td></td>" +
                "<td class='text-right'><b>" + oData.invoice.sums.net + "</b></td>" +
                "<td class='text-right'><b>" + oData.invoice.sums.vat1 +
                "/" + oData.invoice.sums.vat2 + "</b></td>" +
                "<td class='text-right'><b>" + oData.invoice.sums.gross + "</b></td>" +
             "</tr></tbody></table></div>";

    return sHtml;
}

/**
 * Gets the invoice positions table header.
 *
 * @return
 */
function getHtmlInvoicePositionsTableHeader() {
    return "" +
    "<thead>" +
        "<tr>" +
            "<th>Menge</th>" +
            "<th>Position</th>" +
            "<th>Einzel</th>" +
            "<th>netto</th>" +
            "<th>MwSt</th>" +
            "<th>brutto</th>" +
        "</tr>" +
    "</thead>";
}

/**
 * Gets the html invoice footer.
 *
 * @return
 */
function getHtmlInvoiceFooter() {
    return "" +
    "<div id='invoice-footer'>" +
        "<div id='invoice-footer-text'>" +
            "<p>" +
                "Bitte überweisen Sie den Rechnungsbetrag innerhalb von <b>sieben Tagen</b> an das<br>oben stehende Konto.<br><br>" +
                "Vielen Dank für das entgegengebrachte Vertrauen.<br><br><br><br><br>Jochen Wehner" +
            "</p>" +
        "</div>" +
    "</div>";
}

/**
 * Generates the id for a new invoice.
 *
 * @param fCallback
 */
function getNewInvoiceId(fCallback) {
    var sCurrYear = new Date().getFullYear();

    getMaxInvoiceId(function(sMaxId, oErr) {
        if(oErr) {
            logger.log(logger.levels.ERR, oErr);
            fCallback(null, oErr);
            return;
        }

        // if first invoice in database
        if(!sMaxId) {
            fCallback(sCurrYear + padZero(1, 3), null);
            return;
        }

        var sYear = sMaxId.substring(0, 4);
        var iIncr = parseInt(sMaxId.substring(4, sMaxId.length));

        // first invoice in new year
        if(sCurrYear != sYear) {
            fCallback(sCurrYear + padZero(1, 3), null);
        }
        // just another invoice in the same year
        else {
            fCallback(sYear + padZero(++iIncr, 3), null);
        }
    });
}

/**
 * Gets the max invoice id.
 *
 * @param fCallback
 */
function getMaxInvoiceId(fCallback) {
    var sSql = "SELECT max(inv_id) AS maxid FROM invoices;";

    postgresDb.query(sSql, function(oErr, oResult) {
        if(oErr) {
            logger.log(logger.levels.ERR, oErr);
            fCallback(null, oErr);
        }
        fCallback(oResult.rows[0].maxid, null);
    });
}

/**
 * Adds leading zeros to a number.
 * e. g.: padZero(34, 5) => 00034
 *
 * @param iNum (number to be padded with zeros)
 * @param iSize (number of digits in total)
 * @return number padded with zeros
 */
function padZero(iNum, iSize) {
    var sNum = iNum + "";
    while(sNum.length < iSize) sNum = "0" + sNum;
    return sNum;
}

/**
 * Validates the invoice data
 * to be added to the database.
 *
 * @param oInvoice (data to be persisted in the db)
 * @return true | false
 */
function validate(oInvoice) {
    return true;
}
