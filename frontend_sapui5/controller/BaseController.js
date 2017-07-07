/**
 * BaseController.
 * 07.07.2017
 *
 * @author Daniel Wehner
 */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function(Controller, History) {
	"use strict";
	
	return Controller.extend("com.danielwehner.invoicekuga.controller.BaseController", {
		
		/**
		 * Returns the router instance.
		 *
		 * @return
		 */
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		
		/**
		 * Navigates back to the previous view. If there
		 * is no previous view, the "Home" view is displayed.
		 *
		 * @param oEvent
		 */
		onNavBack: function(oEvent) {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			
			if(sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("appHome", {}, true /* no history */);
			}
		}
	});
});