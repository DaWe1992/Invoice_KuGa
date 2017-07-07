/**
 * NotFoundController.
 * 07.07.2017
 *
 * @author Daniel Wehner
 */
sap.ui.define([
	"com/danielwehner/invoicekuga/controller/BaseController"
], function(BaseController) {
	"use strict";
   
	return BaseController.extend("com.danielwehner.invoicekuga.controller.NotFound", {
		
		/**
		 * onInit function.
		 */
		onInit: function() {
			var oRouter = this.getRouter();
			var oTarget = oRouter.getTarget("notFound");
			
			oTarget.attachDisplay(function(oEvent) {
				this._oData = oEvent.getParameter("data"); // store the data
			}, this);
		},
		
		/**
		 * Overrides the onNavBack function of the
		 * parent class.
		 *
		 * @param oEvent
		 * @override
		 */
		onNavBack: function(oEvent) {
			// in some cases certain target can be displayed when the back button is pressed
			if(this._oData && this._oData.fromTarget) {
				this.getRouter().getTargets().display(this._oData.fromTarget);
				delete this._oData.fromTarget;
				return;
			}
			
			// call the parent's onNavBack
			BaseController.prototype.onNavBack.apply(this, arguments);
		}
	});
});