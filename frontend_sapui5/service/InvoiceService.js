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
            this._http.perform("GET", "/invoices", fSuccess, fError);
        }
    });
});
