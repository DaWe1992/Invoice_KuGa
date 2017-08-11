/**
 * SessionService.
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

    return UI5Object.extend("com.danielwehner.invoicekuga.service.SessionService", {

        /**
         * Constructor.
         */
        constructor: function() {
            this._http = new Http();
        },

        /**
         * Logs the user out.
         *
         * @param fSuccess (callback in case of success)
         * @param fError (callback in case of error)
         */
        logout: function(fSuccess, fError) {
            this._http.performPost("/logout", fSuccess, fError);
        }
    });
});
