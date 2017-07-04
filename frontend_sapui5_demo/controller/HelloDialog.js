/**
 * HelloDialog controller.
 * 03.07.2017
 * @author Daniel Wehner
 */
sap.ui.define([
    "sap/ui/base/Object"
], function (UI5Object) {
	"use strict";

	return UI5Object.extend("com.danielwehner.invoicekuga.controller.HelloDialog", {

		constructor: function(oView) {
			this._oView = oView;
		},

		open: function() {
			var oView = this._oView;
			var oDialog = oView.byId("helloDialog");

			// create dialog lazily
			if(!oDialog) {
				var oFragmentController = {
					onCloseDialog : function() {
						oDialog.close();
					}
				};

				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "com.danielwehner.invoicekuga.fragment.HelloDialog", oFragmentController);
				// connect dialog to the root view of this component (models, lifecycle)
				oView.addDependent(oDialog);
			}
			oDialog.open();
		}
	});
});
