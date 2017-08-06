/**
 * CustomerNew controller.
 * 15.07.2017
 *
 * @author Daniel Wehner
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
sap.ui.define([
    "com/danielwehner/invoicekuga/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "com/danielwehner/invoicekuga/service/CustomerService"
], function(BaseController, JSONModel, MessageBox, CustomerService) {
    "use strict";

    var self;

    return BaseController.extend("com.danielwehner.invoicekuga.controller.customer.CustomerNew", {

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
                // persist the new customer in the database
                new CustomerService().addCustomer(
                    self._wizard.getModel().getData(),
                    function(res) {
                        MessageBox.success(
                            self.getTextById("Misc.success.data.save") + " " + res.data.id
                        );
                    },
                    function(res) {
                        MessageBox.error(
                            self.getTextById("Misc.error.data.send")
                        );
                    }
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
            var sAddress = oView.byId("newCustomerAddress").getValue();
            var sLastname = oView.byId("newCustomerLastname").getValue();
            var sStreet = oView.byId("newCustomerStreet").getValue();
            var sZip = oView.byId("newCustomerZip").getValue();
            var sCity = oView.byId("newCustomerCity").getValue();

            if(sAddress.length === 0 || sLastname.length === 0 ||
            sStreet.length === 0 || sZip.length === 0 || sCity.length === 0) {
                this._wizard.invalidateStep(oView.byId("customerHeadStep"));
            } else {
                this._wizard.validateStep(oView.byId("customerHeadStep"));
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

            // create contact object
            var oContact = {
                type: oInputType.getValue(),
                data: oInputData.getValue(),
                comments: oInputComments.getValue()
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
