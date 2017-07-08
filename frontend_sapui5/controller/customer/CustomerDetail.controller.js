/**
 * CustomerDetail controller.
 * 04.07.2017
 *
 * @author Daniel Wehner
 */
sap.ui.define([
    "com/danielwehner/invoicekuga/controller/BaseController",
    "com/danielwehner/invoicekuga/controller/customer/AddContactDialog"
], function(BaseController, AddContactDialog) {
    "use strict";

    return BaseController.extend("com.danielwehner.invoicekuga.controller.customer.CustomerDetail", {

        /**
         * onInit function.
         */
        onInit: function() {
            this._addContactDialog = new AddContactDialog(this.getView());
        },

        /**
         * Opens the AddContactDialog.
         */
        onOpenAddContactDialog: function() {
            this._addContactDialog.open();
        }
    });
});
