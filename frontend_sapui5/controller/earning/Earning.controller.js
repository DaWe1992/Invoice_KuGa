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
    "sap/ui/model/json/JSONModel"
], function(BaseController, EarningService, AddEarningDialog, JSONModel) {
    "use strict";

    return BaseController.extend("com.danielwehner.invoicekuga.controller.earning.Earning", {

        /**
         * onInit function.
         * Loads the cash earnings.
         */
        onInit: function() {
            // get all earnings
            this._getEarnings();
            this._addEarningDialog = new AddEarningDialog(this.getView());
        },

        /**
         * Gets the daily cash earnings.
         */
        _getEarnings: function() {
            var oView = this.getView();

            new EarningService().getEarnings(function(res) {
                var oModel = new JSONModel(res.data);
                oView.setModel(oModel);
            }, function(res) {
                // add error handling
            });
        },

        /**
         * Opens the AddEarningDialog.
         */
        onOpenAddEarningDialog: function() {
            this._addEarningDialog.open();
        }
    });
});
