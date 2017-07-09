/**
 * CustomerService.
 * 07.07.2017
 *
 * @author Daniel Wehner
 */
sap.ui.define([
    "sap/ui/base/Object",
    "com/danielwehner/invoicekuga/util/Http"
], function(UI5Object, Http) {
    "use strict";

    return UI5Object.extend("com.danielwehner.invoicekuga.service.CustomerService", {

        /**
         * Constructor.
         */
        constructor: function() {
            this._http = new Http();
        },

        /**
         * Gets all customers from the backend
         *
         * @param success (callback in case of success)
         * @param error (callback in case of error)
         */
        getCustomers: function(success, error) {
            this._http.perform("GET", "/customers", success, error);
        },

        /**
         * Gets a specific customer by id.
         *
         * @param id (customer id)
         * @param success (callback in case of success)
         * @param error (callback in case of error)
         */
        getCustomer: function(id, success, error) {
            this._http.perform("GET", "/customers/" + id, success, error);
        },

        addContact: function(oContact) {
            this._http.perform("POST", "/customers/" + id + "/contacts", success, error);
        }
    });
});
