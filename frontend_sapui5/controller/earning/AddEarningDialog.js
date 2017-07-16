/**
 * AddEarningDialog.
 * 08.07.2017
 *
 * @author Daniel Wehner
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
sap.ui.define([
    "sap/ui/base/Object"
], function(UI5Object) {
	"use strict";

	return UI5Object.extend("com.danielwehner.invoicekuga.controller.customer.AddEarningDialog", {

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
            var oDialog = oView.byId("addEarningDialog");

            // create dialog lazily
            if(!oDialog) {

                // create a controller for the fragment
                var oFragmentController = {
                    onCancelDialog: function() {
                        oDialog.close();
                    },

                    onSaveNewContact: function() {
                        // do post request
                    }
                };

                // create dialog via fragment factory
                oDialog = sap.ui.xmlfragment(
                    oView.getId(),
                    "com.danielwehner.invoicekuga.fragment.AddEarningDialog",
                    oFragmentController
                );
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
