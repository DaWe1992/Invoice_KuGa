/**
 * User controller.
 * 19.08.2017
 *
 * @author Daniel Wehner
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
sap.ui.define([
    "com/danielwehner/invoicekuga/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "com/danielwehner/invoicekuga/service/UserService",
], function(BaseController, JSONModel, UserService) {
    "use strict";

    var self;

    return BaseController.extend("com.danielwehner.invoicekuga.controller.user.User", {

        /**
         * onInit function.
         * Gets all users from the server.
         */
        onInit: function() {
            self = this;
            this._getUsers(function(data) {
                self.getView().setModel(
                    new JSONModel(data)
                );
            });
        },

        /**
         * Gets all users from the server.
         *
         * @param fCallback
         */
        _getUsers: function(fCallback) {
            new UserService().getUsers(function(res) {
                fCallback(res.data);
            },
            function(res) {
                MessageBox.error(this.getTextById("Misc.error.data.load"));
            });
        }
    });
});
