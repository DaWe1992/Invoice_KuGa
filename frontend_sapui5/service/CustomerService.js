/**
 * CustomerService.
 * 07.07.2017
 *
 * @author Daniel Wehner
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
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
         * @param fSuccess (callback in case of success)
         * @param fError (callback in case of error)
         */
        getCustomers: function(fSuccess, fError) {
            this._http.performGet("/customers", fSuccess, fError);
        },

        /**
         * Gets a specific customer by id.
         *
         * @param id (customer id)
         * @param fSuccess (callback in case of success)
         * @param fError (callback in case of error)
         */
        getCustomer: function(id, fSuccess, fError) {
            this._http.performGet("/customers/" + id, fSuccess, fError);
        },

        /**
         * Adds a customer to the database.
         *
         * @param oCustomer (customer data to be sent to the server)
         * @param fSuccess (callback in case of success)
         * @param fError (callback in case of error)
         */
        addCustomer: function(oCustomer, fSuccess, fError) {
            this._http.performPost("/customers", oCustomer, fSuccess, fError);
        },

        /**
         * Adds a contact to the customer.
         *
         * @param id (customer id)
         * @param oContact (contact data to be sent to the server)
         * @param fSuccess (callback in case of success)
         * @param fError (callback in case of error)
         */
        addContact: function(id, oContact, fSuccess, fError) {
            this._http.performPost("/customers/" + id + "/contacts", oContact, fSuccess, fError);
        }
    });
});
