/**
 * Http.
 * 07.07.2017
 *
 * @author Daniel Wehner
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
sap.ui.define([
    "sap/ui/base/Object"
], function(UI5Object) {
    "use strict";

    return UI5Object.extend("com.danielwehner.invoicekuga.util.Http", {

        /**
         * Constructor.
         */
        constructor: function() {},

        /**
         * Performs an AJAX request.
         *
         * @deprecated
         * @param sReqMethod (GET, POST, PUT, DELETE, ...)
         * @param sReqUrl (REST endpoint)
         * @param fSuccess (callback in case of success)
         * @param fError (callback in case of error)
         */
        perform: function(sReqMethod, sReqUrl, fSuccess, fError) {
            $.ajax({
                url: sReqUrl,
                method: sReqMethod,
                statusCode: {
                    200: function(res) {fSuccess(res)},
                    201: function(res) {fSuccess(res)},
                    400: function(res) {fError(res)},
                    500: function(res) {fError(res)}
                }
            });
        },

        performGet: function() {

        },

        /**
         * Performs a AJAX POST request.
         *
         * @param sReqUrl (REST endpoint)
         * @param oData (data to be posted)
         * @param fSuccess (callback in case of success)
         * @param fError (callback in case of error)
         */
        performPost: function(sReqUrl, oData, fSuccess, fError) {
            $.ajax({
                url: sReqUrl,
                method: "POST",
                data: oData,
                statusCode: {
                    200: function(res) {fSuccess(res)},
                    201: function(res) {fSuccess(res)},
                    400: function(res) {fError(res)},
                    500: function(res) {fError(res)}
                }
            });
        },

        performPut: function() {

        },

        performDelete: function() {

        }
    });
});
