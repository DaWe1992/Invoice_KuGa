/**
 * InvoiceDetail controller.
 * 16.07.2017
 *
 * @author Daniel Wehner
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
sap.ui.define([
    "com/danielwehner/invoicekuga/controller/BaseController",
    "com/danielwehner/invoicekuga/service/InvoiceService",
    "com/danielwehner/invoicekuga/service/LockService",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function(BaseController, InvoiceService, LockService, JSONModel, MessageToast) {
    "use strict";

    var self;

    return BaseController.extend("com.danielwehner.invoicekuga.controller.invoice.InvoiceDetail", {

        /**
         * onInit function.
         */
        onInit: function() {
            self = this;

            this.getEvtBus().subscribe(
                "invoiceChannel", "invoiceChangedEvent", this._handleInvoiceChangedEvent
            );

            this.getView().setModel(
                new JSONModel({
                    "enabled": false
                }
            ), "settings");
        },

        /**
         * Shows a message toast when an invoice is printed.
         *
         * @param oEvent
         */
        onInvoicePrint: function(oEvent) {
            MessageToast.show(
                self.getTextById("Misc.wait.for.invoice")
            );
        },

        /**
         * Toggles the data record lock.
         *
         * @param oEvent
         */
        onToggleInvoiceLock: function(oEvent) {
            var oToggleButton = oEvent.getSource();
            var sId = this.getView().getModel().getData().invoice.id;
            var bWantToLock = oToggleButton.getPressed();

            if(bWantToLock) {
                // record should be locked

                // check if record is locked already
                new LockService().isInvoiceLocked(sId, function(res) {

                    if(res.data) {
                        // already locked
                        MessageToast.show(
                            self.getTextById("Misc.record.currently.locked") +
                            res.data.user
                        );
                        oToggleButton.setPressed(false);
                    } else {
                        // not yet locked
                        new LockService().lockInvoice(sId, function(res) {
                            var oModel = self.getView().getModel("settings");
                            oModel.getData().enabled = true;
                            oModel.refresh();
                        }, function(res) {});
                    }
                }, function(res) {});

            } else {
                // record should be unlocked
                new LockService().unlockInvoice(sId, function(res) {
                    var oModel = self.getView().getModel("settings");
                    oModel.getData().enabled = false;
                    oModel.refresh();
                }, function(res) {});
            }
        },

        /**
         * Checks if the invoice to be displayed
         * is locked by the current user.
         *
         * @param sChannel
         * @param sEvent
         * @param oData
         */
        _handleInvoiceChangedEvent: function(sChannel, sEvent, oData) {
            var oModel = self.getView().getModel("settings");
            var oToggleButton = self.getView().byId("toggleInvoiceLock");

            new LockService().isInvoiceLockedByCurrentUser(oData.id, function(res) {
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
