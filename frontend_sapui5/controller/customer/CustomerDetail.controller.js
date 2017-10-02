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
    "com/danielwehner/invoicekuga/service/LockService",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function(BaseController, AddContactDialog, LockService, JSONModel, MessageToast) {
    "use strict";

    var self;

    return BaseController.extend("com.danielwehner.invoicekuga.controller.customer.CustomerDetail", {

        /**
         * onInit function.
         */
        onInit: function() {
            self = this;

            this.getEvtBus().subscribe(
                "customerChannel", "customerChangedEvent", this._handleCustomerChangedEvent
            );

            this._addContactDialog = new AddContactDialog(this.getView());

            this.getView().setModel(
                new JSONModel({
                    "enabled": false
                }
            ), "settings");
        },

        /**
         * Opens the AddContactDialog.
         */
        onOpenAddContactDialog: function() {
            this._addContactDialog.open();
        },

        /**
         * Toggles the data record lock.
         *
         * @param oEvent
         */
        onToggleCustomerLock: function(oEvent) {
            var oToggleButton = oEvent.getSource();
            var sId = this.getView().getModel().getData().customer.id;
            var bWantToLock = oToggleButton.getPressed();

            if(bWantToLock) {
                // record should be locked

                // check if record is locked already
                new LockService().isCustomerLocked(sId, function(res) {

                    if(res.data) {
                        // already locked
                        MessageToast.show(
                            self.getTextById("Misc.record.currently.locked") +
                            res.data.user
                        );
                        oToggleButton.setPressed(false);
                    } else {
                        // not yet locked
                        new LockService().lockCustomer(sId, function(res) {
                            var oModel = self.getView().getModel("settings");
                            oModel.getData().enabled = true;
                            oModel.refresh();
                        }, function(res) {});
                    }
                }, function(res) {});

            } else {
                // record should be unlocked
                new LockService().unlockCustomer(sId, function(res) {
                    var oModel = self.getView().getModel("settings");
                    oModel.getData().enabled = false;
                    oModel.refresh();
                }, function(res) {});
            }
        },

        /**
         * Saves the changed made to the customer data.
         *
         * @param oEvent
         */
        onCustomerSave: function(oEvent) {

        },

        /**
         * Deletes the currently displayed customer.
         *
         * @param oEvent
         */
        onCustomerDelete: function(oEvent) {

        },

        /**
         * Checks if the customer to be displayed
         * is locked by the current user.
         *
         * @param sChannel
         * @param sEvent
         * @param oData
         */
        _handleCustomerChangedEvent: function(sChannel, sEvent, oData) {
            var oModel = self.getView().getModel("settings");
            var oToggleButton = self.getView().byId("toggleCustomerLock");

            new LockService().isCustomerLockedByCurrentUser(oData.id, function(res) {
                if(res.data) {
                    oModel.getData().enabled = true;
                    oToggleButton.setPressed(true);
                } else {
                    oModel.getData().enabled = false;
                    oToggleButton.setPressed(false);
                }
                oModel.refresh();
            });
        }
    });
});
