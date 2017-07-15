/**
 * Earning controller.
 * 08.07.2017
 *
 * @author Daniel Wehner
 */
sap.ui.define([
    "com/danielwehner/invoicekuga/controller/BaseController",
    "com/danielwehner/invoicekuga/service/EarningService",
    "com/danielwehner/invoicekuga/controller/earning/AddEarningDialog",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function(BaseController, EarningService, AddEarningDialog, JSONModel, MessageBox) {
    "use strict";

    return BaseController.extend("com.danielwehner.invoicekuga.controller.earning.Earning", {

        /**
         * onInit function.
         * Loads the cash earnings.
         */
        onInit: function() {
            // get all earnings
            this._getEarnings(function(data) {
                var oModel = new JSONModel(data);
                oView.setModel(oModel);
            });
            this._addEarningDialog = new AddEarningDialog(this.getView());
        },

        /**
         * Opens the AddEarningDialog.
         */
        onOpenAddEarningDialog: function() {
            this._addEarningDialog.open();
        },

        /**
         * Gets the daily cash earnings.
         *
         * @param fCallback
         */
        _getEarnings: function(fCallback) {
            var oView = this.getView();

            new EarningService().getEarnings(function(res) {
                fCallback(res.data);
            }, function(res) {
                MessageBox.error(this.getResBundle().getText("Misc.error.data.load"));
            });
        }
    });
});
