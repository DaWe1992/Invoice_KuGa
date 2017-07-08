/**
 * AppController.
 * 04.07.2017
 *
 * @author Daniel Wehner
 */
sap.ui.define([
    "com/danielwehner/invoicekuga/controller/BaseController",
    "com/danielwehner/invoicekuga/service/SessionService",
    "sap/m/Popover",
	"sap/m/Button",
    "sap/m/Label"
], function(BaseController, SessionService, Popover, Button, Label) {
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
         * Displays a popover when
         * the user name is pressed.
         *
         * @param oEvent
         */
        handleUserNamePress: function(oEvent) {
			var popover = new Popover({
                showHeader: false,
				placement: sap.m.PlacementType.Bottom,
				content: [
                    new Button({
                        text: "Nutzer",
                        icon: "sap-icon://notes",
                        type: sap.m.ButtonType.Transparent,
                        press: ""
                    }),
					new Button({
						text: "Logout",
                        icon: "sap-icon://log",
						type: sap.m.ButtonType.Transparent,
                        press: this.logout
					})
				]
			}).addStyleClass("sapMOTAPopover sapTntToolHeaderPopover");

			popover.openBy(oEvent.getSource());
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
         * Navigates to the earnings page.
         */
        onNavToEarnings: function() {
            this.getRouter().navTo("earnings");
        }
    });
});
