/**
 * LockService.
 * 19.08.2017
 *
 * @author Daniel Wehner
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
sap.ui.define([
    "sap/ui/base/Object",
    "com/danielwehner/invoicekuga/util/Http"
], function(UI5Object, Http) {
    "use strict";

    return UI5Object.extend("com.danielwehner.invoicekuga.service.LockService", {

        /**
         * Constructor.
         */
        constructor: function() {
            this._http = new Http();
        },

        /**
         * Locks customer record.
         *
         * @param sId (id of customer to be locked)
         * @param fSuccess (callback in case of success)
         * @param fError (callback in case of error)
         */
        lockCustomer: function(sId, fSuccess, fError) {
            this._http.performPost("/customers/" + sId + "/lock", null, fSuccess, fError);
        },

        /**
         * Unlocks customer record.
         *
         * @param sId (id of customer to be unlocked)
         * @param fSuccess (callback in case of success)
         * @param fError (callback in case of error)
         */
        unlockCustomer: function(sId, fSuccess, fError) {
            this._http.performPost("/customers/" + sId + "/unlock", null, fSuccess, fError);
        },

        /**
         * Checks lock status of customer record.
         *
         * @param sId (id of customer to be checked)
         * @param fSuccess (callback in case of success)
         * @param fError (callback in case of error)
         */
        isCustomerLocked: function(sId, fSuccess, fError) {
            this._http.performGet("/customers/" + sId + "/isLocked", fSuccess, fError);
        },

        /**
         * Checks lock status of customer record.
         * Checks if the current user locked the customer record.
         *
         * @param sId (id of customer to be checked)
         * @param fSuccess (callback in case of success)
         * @param fError (callback in case of error)
         */
        isCustomerLockedByCurrentUser: function(sId, fSuccess, fError) {
            this._http.performGet("/customers/" + sId + "/isLocked?byCurrentUser=true", fSuccess, fError);
        },

        /**
         * Locks invoice record.
         *
         * @param sId (id of invoice to be locked)
         * @param fSuccess (callback in case of success)
         * @param fError (callback in case of error)
         */
        lockInvoice: function(sId, fSuccess, fError) {
            this._http.performPost("/invoices/" + sId + "/lock", null, fSuccess, fError);
        },

        /**
         * Unlocks invoice record.
         *
         * @param sId (id of invoice to be unlocked)
         * @param fSuccess (callback in case of success)
         * @param fError (callback in case of error)
         */
        unlockInvoice: function(sId, fSuccess, fError) {
            this._http.performPost("/invoices/" + sId + "/unlock", null, fSuccess, fError);
        },

        /**
         * Checks lock status of invoice record.
         *
         * @param sId (id of invoice to be checked)
         * @param fSuccess (callback in case of success)
         * @param fError (callback in case of error)
         */
        isInvoiceLocked: function(sId, fSuccess, fError) {
            this._http.performGet("/invoices/" + sId + "/isLocked", fSuccess, fError);
        },

        /**
         * Checks lock status of invoice record.
         * Checks if the current user locked the invoice record.
         *
         * @param sId (id of invoice to be checked)
         * @param fSuccess (callback in case of success)
         * @param fError (callback in case of error)
         */
        isInvoiceLockedByCurrentUser: function(sId, fSuccess, fError) {
            this._http.performGet("/invoices/" + sId + "/isLocked?byCurrentUser=true", fSuccess, fError);
        }
    });
});
