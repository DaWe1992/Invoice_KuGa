/**
 * EarningService.
 * 08.07.2017
 *
 * @author Daniel Wehner
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
sap.ui.define([
    "sap/ui/base/Object",
    "com/danielwehner/invoicekuga/util/Http"
], function(UI5Object, Http) {
    "use strict";

    return UI5Object.extend("com.danielwehner.invoicekuga.service.EarningService", {

        /**
         * Constructor.
         */
        constructor: function() {
            this._http = new Http();
        },

        /**
         * Gets all daily cash earnings from the backend.
         *
         * @param success (callback in case of success)
         * @param error (callback in case of error)
         */
        getEarnings: function(success, error) {
            this._http.perform("GET", "/daily-cash-earnings", success, error);
        }
    });
});
