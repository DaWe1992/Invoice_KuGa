/**
 * InvoiceService.
 * 16.07.2017
 *
 * @author Daniel Wehner
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
sap.ui.define([
    "sap/ui/base/Object",
    "com/danielwehner/invoicekuga/util/Http"
], function(UI5Object, Http) {
    "use strict";

    return UI5Object.extend("com.danielwehner.invoicekuga.service.InvoiceService", {

        /**
         * Constructor.
         */
        constructor: function() {
            this._http = new Http();
        },

        /**
         * Gets all invoices from the backend
         *
         * @param fSuccess (callback in case of success)
         * @param fError (callback in case of error)
         */
        getInvoices: function(fSuccess, fError) {
            this._http.performGet("/invoices", fSuccess, fError);
        },

        /**
         * Gets a specific invoice by id.
         *
         * @param id (invoice id)
         * @param fSuccess (callback in case of success)
         * @param fError (callback in case of error)
         */
        getInvoice: function(id, fSuccess, fError) {
            this._http.performGet("/invoices/" + id, fSuccess, fError);
        },

        /**
         * Adds an invoice to the database.
         *
         * @param oData (invoice data to be sent to the server)
         * @param fSuccess (callback in case of success)
         * @param fError (callback in case of error)
         */
        addInvoice: function(oData, fSuccess, fError) {
            this._http.performPost("/invoices", oData, fSuccess, fError);
        },

        /**
         * Prints the invoice specified.
         *
         * @param sId (id of the invoice)
         * @param fSuccess (callback in case of success)
         * @param fError (callback in case of error)
         */
        printInvoice: function(sId, fSuccess, fError) {
            this._http.performGet("/invoices/" + sId + "/print", fSuccess, fError);
        }
    });
});
