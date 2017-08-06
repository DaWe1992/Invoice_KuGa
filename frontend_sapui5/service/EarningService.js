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
         * @param fSuccess (callback in case of success)
         * @param fError (callback in case of error)
         */
        getEarnings: function(fSuccess, fError) {
            this._http.performGet("/daily-cash-earnings", fSuccess, fError);
        },

        /**
         * Adds an earning to the database.
         *
         * @param oEarning (earning data to be sent to the server)
         * @param fSuccess (callback in case of success)
         * @param fError (callback in case of error)
         */
        addEarning: function(oEarning, fSuccess, fError) {
            this._http.performPost("/daily-cash-earnings", oEarning, fSuccess, fError);
        }
    });
});
