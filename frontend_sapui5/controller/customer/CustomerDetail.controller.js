/**
 * CustomerDetail controller.
 * 04.07.2017
 *
 * @author Daniel Wehner
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
sap.ui.define([
    "com/danielwehner/invoicekuga/controller/BaseController",
    "com/danielwehner/invoicekuga/controller/customer/AddContactDialog",
    "sap/ui/model/json/JSONModel"
], function(BaseController, AddContactDialog, JSONModel) {
    "use strict";

    return BaseController.extend("com.danielwehner.invoicekuga.controller.customer.CustomerDetail", {

        /**
         * onInit function.
         */
        onInit: function() {
            this._addContactDialog = new AddContactDialog(this.getView());

            this.getView().setModel(new JSONModel({
                "enabled": false
            }), "settings");
        },

        /**
         * Opens the AddContactDialog.
         */
        onOpenAddContactDialog: function() {
            this._addContactDialog.open();
        }
    });
});
