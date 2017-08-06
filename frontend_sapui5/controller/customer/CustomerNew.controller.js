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
            var aInputControls = [
                oView.byId("contactType"), oView.byId("contactData"),
                oView.byId("contactComments")
            ];

            // create contact object
            var oContact = {
                type: aInputControls[0].getValue(),
                data: aInputControls[1].getValue(),
                comments: aInputControls[2].getValue()
            };

            // add contact to model
            this._wizard.getModel().getData().contacts.push(oContact);
            this._wizard.getModel().refresh();

            // empty controls
            aInputControls.forEach(function(control) {
                control.setValue("");
            });
        },

        /**
         * Handles the completion of the wizard.
         *
         * @param oEvent
         */
        onWizardComplete: function(oEvent) {
            this.getView().byId("btnSaveNewCustomer").setVisible(true);
        },

        /**
         * Persists the new customer in the database.
         *
         * @param oEvent
         */
        onNewCustomerSave: function(oEvent) {
            new CustomerService().addCustomer(
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
         * Cancels the new customer.
         *
         * @param oEvent
         */
        onNewCustomerCancel: function(oEvent) {

        }
    });
});
