/**
 * AppController.
 * 04.07.2017
 *
 * @author Daniel Wehner
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
sap.ui.define([
    "com/danielwehner/invoicekuga/controller/BaseController",
    "com/danielwehner/invoicekuga/service/SessionService",
    "sap/m/Popover",
	"sap/m/Button"
], function(BaseController, SessionService, Popover, Button) {
    "use strict";

    return BaseController.extend("com.danielwehner.invoicekuga.controller.App", {

        /**
         * onInit function.
         * Sets the content density class for the app.
         */
        onInit: function() {
            /*this.getView().addStyleClass(
                this.getOwnerComponent().getContentDensityClass()
            );*/
        },

        /**
         * Toggles side bar navigation.
         */
        onSideNavButtonPress: function() {
            var viewId = this.getView().getId();
            var toolPage = sap.ui.getCore().byId(viewId + "--toolPage");
            var sideExpanded = toolPage.getSideExpanded();

            // toggle side navigation
			toolPage.setSideExpanded(!toolPage.getSideExpanded());
        },

        /**
         * Displays a popover when
         * the user name is pressed.
         *
         * @param oEvent
         */
        handleUserNamePress: function(oEvent) {
			var oPopover = new Popover({
                showHeader: true,
                title: this.getTextById("Misc.actions"),
				placement: sap.m.PlacementType.Bottom,
				content: [
                    new Button({
                        text: this.getTextById("App.user"),
                        icon: "sap-icon://notes",
                        type: sap.m.ButtonType.Transparent,
                        press: ""
                    }),
					new Button({
						text: this.getTextById("App.logout"),
                        icon: "sap-icon://log",
						type: sap.m.ButtonType.Transparent,
                        press: this.logout
					})
				]
			}).addStyleClass("sapMOTAPopover sapTntToolHeaderPopover");

			oPopover.openBy(oEvent.getSource());
		},

        /**
         * Logs user out.
         */
        logout: function() {
            new SessionService().logout(
                function() {location.reload();},
                function() {}
            );
        },

		/**
		 * Navigates to the customer page.
		 */
		onNavToCustomers: function() {
			this.getRouter().navTo("customers");
		},

        /**
         * Navigates to the invoice page.
         */
        onNavToInvoices: function() {
            this.getRouter().navTo("invoices");
        },

        /**
         * Navigates to the earnings page.
         */
        onNavToEarnings: function() {
            this.getRouter().navTo("earnings");
        }
    });
});
