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
        constructor: function() {},

        /**
         * Gets all customers from the backend
         *
         * @param success (callback in case of success)
         * @param error (callback in case of error)
         */
        getCustomers: function(success, error) {
            new Http().perform("GET", "/customers", success, error);
        }
    });
});
