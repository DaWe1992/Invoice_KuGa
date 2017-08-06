/**
 * InvoiceNew controller.
 * 16.07.2017
 *
 * @author Daniel Wehner
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
sap.ui.define([
    "com/danielwehner/invoicekuga/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "com/danielwehner/invoicekuga/service/InvoiceService",
    "sap/m/MessageBox"
], function(BaseController, JSONModel, InvoiceService, MessageBox) {
    "use strict";

    var self;

    return BaseController.extend("com.danielwehner.invoicekuga.controller.invoice.InvoiceNew", {

        /**
         * onInit function.
         * Sets the model for the wizard.
         */
        onInit: function() {
            self = this;
            var oDate = new Date();
            var sCurrDate = oDate.getDate() + "." + (oDate.getMonth() + 1) + "." + oDate.getFullYear();
            this._wizard = this.getView().byId("invoiceWizard");

            this._wizard.setModel(
                new JSONModel({
                    "invoice": {
                        "description": "",
                        "date": sCurrDate,
                        "deliveryDate": "",
                        "room": "",
                        "comments": "",
                        "positions": []
                    },
                    "customer": {
                        "id": ""
                    }
                })
            );
        },

        /**
         * Validates if the invoice data
         * has been entered correctly. Only then
         * the navigation to the next step (invoice positions) is activated.
         */
        validateInvoiceHeadStep: function() {
            var oView = this.getView();
            var sDescription = oView.byId("newInvoiceDescription").getValue();
            var sDate = oView.byId("newInvoiceDate").getValue();
            var sCustomerId = oView.byId("newInvoiceCustomerId").getValue();

            if(sDescription.length === 0 || sDate.length === 0 ||
            sCustomerId.length === 0) {
                this._wizard.invalidateStep(oView.byId("invoiceHeadStep"));
            } else {
                this._wizard.validateStep(oView.byId("invoiceHeadStep"));
            }
        },

        /**
         * Adds a new position to the invoice.positions array.
         *
         * @param oEvent
         */
        onPositionAdd: function(oEvent) {
            var oView = this.getView();

            // get input controls
            var oInputPos = oView.byId("pos");
            var oInputQuantity = oView.byId("quantity");
            var oInputUnitprice = oView.byId("unitprice");
            var oInputVatrate = oView.byId("vatrate");

            // create invoice position object
            var oPosition = {
                pos: oInputPos.getValue(),
                quantity: oInputQuantity.getValue(),
                unitprice: oInputUnitprice.getValue(),
                vatrate: oInputVatrate.getValue()
            };

            // add invoice position to model
            this._wizard.getModel().getData().invoice.positions.push(oPosition);
            this._wizard.getModel().refresh();

            // empty controls
            oInputPos.setValue("");
            oInputQuantity.setValue("");
            oInputUnitprice.setValue("");
            oInputVatrate.setValue("");
        },

        /**
         * Handles the completion of the wizard.
         *
         * @param oEvent
         */
        onWizardComplete: function(oEvent) {
            var oView = this.getView();
            oView.byId("btnSaveNewInvoice").setVisible(true);
            oView.byId("btnSaveAndPrintNewInvoice").setVisible(true);
        },

        /**
         * Saves the new invoice.
         *
         * @param oEvent
         */
        onNewInvoiceSave: function(oEvent) {
            new InvoiceService().addInvoice(
                self._wizard.getModel().getData(),
                // callback in case of success
                function(res) {
                    MessageBox.success(
                        self.getTextById("Misc.success.data.save") +
                        " " + res.data.id
                    );
                },
                // callback in case of error
                function(res) {
                    MessageBox.error(
                        self.getTextById("Misc.error.data.send")
                    );
                }
            );
        },

        /**
         * Saves and prints the invoice.
         *
         * @param oEvent
         */
        onNewInvoiceSaveAndPrint: function(oEvent) {

        },

        /**
         * Cancels the new invoice.
         *
         * @param oEvent
         */
        onNewInvoiceCancel: function(oEvent) {

        },

        /**
         * Prints the invoice and displays
         * a MessageToast requesting the user to be patient.
         *
         * @param oEvent
         */
        onInvoicePrint: function(oEvent) {
            MessageToast.show(
                self.getTextById("Misc.wait.for.invoice"), {
                    duration: 5000
                }
            );
        }
    });
});
