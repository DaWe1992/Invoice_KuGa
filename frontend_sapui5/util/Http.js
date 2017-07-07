/**
 * Http.
 * 07.07.2017
 *
 * @author Daniel Wehner
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
         * @param reqMethod (GET, POST, PUT, DELETE, ...)
         * @param reqUrl (REST endpoint)
         * @param success (callback in case of success)
         * @param error (callback in case of error)
         */
        perform: function(reqMethod, reqUrl, success, error) {
            $.ajax({
                url: reqUrl,
                method: reqMethod,
                statusCode: {
                    200: function(res) {success(res)},
                    400: function(res) {error(res)},
                    500: function(res) {error(res)}
                }
            });
        }
    });
});
