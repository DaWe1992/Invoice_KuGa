/**
 * StatisticsService.
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

    return UI5Object.extend("com.danielwehner.invoicekuga.service.StatisticsService", {

        /**
         * Constructor.
         */
        constructor: function() {
            this._http = new Http();
        },

        /**
         * Gets the event revenue clustered by months.
         *
         * @param fSuccess (callback in case of success)
         * @param fError (callback in case of error)
         */
        getEvtRevByMonth: function(fSuccess, fError) {
            this._http.performGet("/statistics/evt-rev-by-month", fSuccess, fError);
        },

        /**
         * Gets the event revenue clustered by customers.
         *
         * @param fSuccess (callback in case of success)
         * @param fError (callback in case of error)
         */
        getEvtRevByCustomer: function(fSuccess, fError) {
            this._http.performGet("/statistics/evt-rev-by-customer", fSuccess, fError);
        },

        /**
         * Gets the cash earnings revenue.
         *
         * @param fSuccess (callback in case of success)
         * @param fError (callback in case of error)
         */
        getCeRev: function(fSuccess, fError) {
            this._http.performGet("statistics/ce-rev", fSuccess, fError);
        }
    });
});
