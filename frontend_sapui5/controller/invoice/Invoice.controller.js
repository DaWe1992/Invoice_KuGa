/**
 * Invoice controller.
 * 16.07.2017
 *
 * @author Daniel Wehner
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
sap.ui.define([
    "com/danielwehner/invoicekuga/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "com/danielwehner/invoicekuga/service/InvoiceService",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/Popover",
    "sap/m/Button"
], function(BaseController, JSONModel, Filter, FilterOperator,
            InvoiceService, MessageBox, MessageToast, Popover, Button) {
    "use strict";

    var self;

    return BaseController.extend("com.danielwehner.invoicekuga.controller.invoice.Invoice", {

        /**
         * onInit function.
         */
        onInit: function() {
            self = this;
            var oView = this.getView();

            this._getInvoices(function(data) {
                var oModel = new JSONModel(data);
                oView.setModel(oModel);
            });
        },

        /**
         * Searches for an invoice in the invoice list.
         *
         * @param oEvent
         */
        onSearch: function(oEvent) {
            var aFilters = [];
            var sQuery = oEvent.getSource().getValue();

            // create the filter
            if(sQuery && sQuery.length > 0) {
                var oFilter = new Filter({
                    filters: [
                        new Filter("description", FilterOperator.Contains, sQuery),
                        new Filter("custlastname", FilterOperator.Contains, sQuery),
                        new Filter("date", FilterOperator.Contains, sQuery)
                    ],
                    and: false
                });
                aFilters.push(oFilter);
            }

            // apply the filter
            var oList = this.getView().byId("invoiceList");
            var oBinding = oList.getBinding("items");
            oBinding.filter(aFilters, "Application");
        },

        /**
         * Opens a popover with further options for the invoice.
         *
         * @param oEvent
         */
        onItemPress: function(oEvent) {
            /*var oPopover = new Popover({
                showHeader: true,
                title: this.getTextById("Misc.actions"),
                placement: sap.m.PlacementType.Right,
                content: [
                    new Button({
                        text: this.getTextById("Invoice.page.master.popover.view"),
                        icon: "sap-icon://display",
                        type: sap.m.ButtonType.Transparent,
                        press: this.onInvoiceShow
                    }),
                    new Button({
                        text: this.getTextById("Invoice.page.master.popover.print"),
                        icon: "sap-icon://print",
                        type: sap.m.ButtonType.Transparent,
                        press: this.onInvoicePrint
                    })
                ]
            }).addStyleClass("sapMOTAPopover sapTntToolHeaderPopover");

            oPopover.openBy(oEvent.getSource());*/
        },

        onInvoiceShow: function() {

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
        },

        onAddInvoice: function() {

        },

        onNewInvoiceSave: function() {

        },

        /**
         * Gets all invoices from the server.
         *
         * @param fCallback
         */
        _getInvoices: function(fCallback) {
            new InvoiceService().getInvoices(function(res) {
                fCallback(res.data);
            }, function(res) {
                MessageBox.error(this.getTextById("Misc.error.data.load"));
            });
        }
    });
});
