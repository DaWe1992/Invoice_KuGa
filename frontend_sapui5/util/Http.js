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
         * @param sReqMethod (GET, POST, PUT, DELETE, ...)
         * @param sReqUrl (REST endpoint)
         * @param fSccess (callback in case of success)
         * @param fError (callback in case of error)
         */
        perform: function(sReqMethod, sReqUrl, fSccess, fError) {
            $.ajax({
                url: sReqUrl,
                method: sReqMethod,
                statusCode: {
                    200: function(res) {fSccess(res)},
                    400: function(res) {fError(res)},
                    500: function(res) {fError(res)}
                }
            });
        },

        performGet: function() {

        },

        performPost: function() {

        },

        performPut: function() {

        },

        performDelete: function() {

        }
    });
});
