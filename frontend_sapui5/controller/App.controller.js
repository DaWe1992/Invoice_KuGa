/**
 * AppController.
 * 04.07.2017
 *
 * @author Daniel Wehner
 */
sap.ui.define([
    "com/danielwehner/invoicekuga/controller/BaseController"
], function(BaseController) {
    "use strict";

    return BaseController.extend("com.danielwehner.invoicekuga.controller.App", {

        /**
         * Toggles side bar navigation.
         */
        onSideNavButtonPress: function() {
            var viewId = this.getView().getId();
            var toolPage = sap.ui.getCore().byId(viewId + "--toolPage");
            var sideExpanded = toolPage.getSideExpanded();

			toolPage.setSideExpanded(!toolPage.getSideExpanded());
        },
		
		/**
		 * Navigates to the customer page.
		 */
		onNavToCustomers: function() {
			this.getRouter().navTo("customers");
		}
    });
});
