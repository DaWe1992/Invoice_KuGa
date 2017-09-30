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
    "sap/m/MessageToast"
], function(BaseController, InvoiceService, MessageToast) {
    "use strict";

    var self;

    return BaseController.extend("com.danielwehner.invoicekuga.controller.invoice.InvoiceDetail", {

        /**
         * onInit function.
         */
        onInit: function() {
            self = this;
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
        }
    });
});
