/**
 * AddContactDialog.
 * 08.07.2017
 *
 * @author Daniel Wehner
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
sap.ui.define([
    "sap/ui/base/Object",
    "sap/ui/model/json/JSONModel"
], function(UI5Object, JSONModel) {
	"use strict";

	return UI5Object.extend("com.danielwehner.invoicekuga.controller.customer.AddContactDialog", {

        /**
         * Constructor.
         *
         * @param oView
         */
        constructor: function(oView) {
            this._oView = oView;
        },

        /**
         * Opens the AddContactDialog.
         */
        open: function() {
            var oView = this._oView;
            var oDialog = oView.byId("addContactDialog");

            // create dialog lazily
            if(!oDialog) {

                // create a controller for the fragment
                var oFragmentController = {

                    /**
                     * Closes the AddContactDialog without any action.
                     */
                    onCancelDialog: function() {
                        oDialog.close();
                    },

                    /**
                     * Saves the new contact
                     * and closes the AddContactDialog.
                     */
                    onSaveNewContact: function() {
                        // do post request

                        oDialog.close();
                    }
                };

                // create dialog via fragment factory
                oDialog = sap.ui.xmlfragment(
                    oView.getId(),
                    "com.danielwehner.invoicekuga.fragment.AddContactDialog",
                    oFragmentController
                );

                // add data model for fragment
                var oModel = new JSONModel({
                    "contact": {
                        "type": "",
                        "data": "",
                        "comments": ""
                    }
                });
                oDialog.setModel(oModel);

                // connect dialog to the root view of this component (models, lifecycle)
                oView.addDependent(oDialog);

                // forward compact/cozy style into dialog
                jQuery.sap.syncStyleClass(
                    oView.getController().getOwnerComponent().getContentDensityClass(), oView, oDialog
                );
            }

            // show dialog
            oDialog.open();
        }
    });
});
