/**
 * CustomerNew controller.
 * 15.07.2017
 *
 * @author Daniel Wehner
 */
sap.ui.define([
    "com/danielwehner/invoicekuga/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function(BaseController, JSONModel, MessageBox) {
    "use strict";

    var self;

    BaseController.extend("com.danielwehner.invoicekuga.controller.customer.CustomerNew", {

        /**
         * onInit function.
         * Sets models for the wizard.
         */
        onInit: function() {
            self = this;
            this._wizard = this.getView().byId("customerWizard");

            this._wizard.setModel(
                new JSONModel({
                    "address": "",
                    "firstname": "",
                    "lastname": "",
                    "street": "",
                    "zip": "",
                    "city": "",
                    "contacts": []
                })
            );

            this.getView().byId("customerForm").setModel(
                new JSONModel({
                    "addressState": "None",
                    "lastnameState": "None",
                    "streetState": "None",
                    "zipState": "None",
                    "cityState": "None"
                }), "validation"
            );

            this.getEvtBus().subscribe("channelNewCustomer", "saveCustomer", function() {
                // TODO: perform POST request
                MessageBox.success(
                    self.getResBundle().getText("Misc.success.data.save")
                );
            });
        },

        /**
         * Validates if the customer data
         * has been entered correctly. Only then
         * the navigation to the next step (customer contacts) is activated.
         */
        validateCustomerHeadStep: function() {
            var oView = this.getView();
            var sAddress = oView.byId("address").getValue();
            var sLastname = oView.byId("lastname").getValue();
            var sStreet = oView.byId("street").getValue();
            var sZip = oView.byId("zip").getValue();
            var sCity = oView.byId("city").getValue();

            if(sAddress.length === 0 || sLastname.length === 0 ||
            sStreet.length === 0 || sZip.length === 0 || sCity.length === 0) {
                this._wizard.invalidateStep(this.getView().byId("customerHeadStep"));
            } else {
                this._wizard.validateStep(this.getView().byId("customerHeadStep"));
            }
        },

        /**
         * Adds a new contact to the contacts array.
         *
         * @param oEvent
         */
        onContactAdd: function(oEvent) {
            var oView = this.getView();

            // get input controls
            var oInputType = oView.byId("contactType");
            var oInputData = oView.byId("contactData");
            var oInputComments = oView.byId("contactComments");

            // get value of input controls
            var sType = oInputType.getValue();
            var sData = oInputData.getValue();
            var sComments = oInputComments.getValue();

            // create contact object
            var oContact = {
                type: sType,
                data: sData,
                comments: sComments
            };

            // add contact to model
            this._wizard.getModel().getData().contacts.push(oContact);
            this._wizard.getModel().refresh();

            // empty controls
            oInputType.setValue("");
            oInputData.setValue("");
            oInputComments.setValue("");
        },

        /**
         * Handles the completion of the wizard.
         *
         * @param oEvent
         */
        onWizardComplete: function(oEvent) {
            this.getEvtBus().publish("channelNewCustomer", "wizardFinished");
        }
    });
});
