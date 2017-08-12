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
	"sap/m/Button",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function(BaseController, SessionService, Popover, Button, JSONModel, MessageBox) {
    "use strict";

    var self;

    return BaseController.extend("com.danielwehner.invoicekuga.controller.App", {

        /**
         * onInit function.
         * Sets the content density class for the app.
         * Sets the session model.
         */
        onInit: function() {
            self  = this;

            // add content density class
            /*this.getView().addStyleClass(
                this.getOwnerComponent().getContentDensityClass()
            );*/

            // set model
            new SessionService().user(
                function(res) {
                    self.getView().setModel(
                        new JSONModel(res.data)
                    );
                },
                function() {

                }
            );
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
                        text: this.getTextById("App.menu.user"),
                        icon: "sap-icon://notes",
                        type: sap.m.ButtonType.Transparent,
                        press: this.showUserInfo
                    }),
					new Button({
						text: this.getTextById("App.menu.logout"),
                        icon: "sap-icon://log",
						type: sap.m.ButtonType.Transparent,
                        press: this.logout
					})
				]
			}).addStyleClass("sapMOTAPopover sapTntToolHeaderPopover");

			oPopover.openBy(oEvent.getSource());
		},

        /**
         * Shows user information.
         */
        showUserInfo: function() {
            var oData = self.getView().getModel().getData();
            MessageBox.information(
                self.getTextById("App.user.body.username") + ": " + oData.username + " | " +
                self.getTextById("App.user.body.email") + ": " + oData.email, {
                    title: self.getTextById("App.menu.user")
                }
            );
        },

        /**
         * Logs user out.
         */
        logout: function() {
            new SessionService().logout(
                function() {location.reload();},
                function() {location.reload();}
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
        },

        /**
         * Navigates to the statistics page.
         */
        onNavToStatistics: function() {
            this.getRouter().navTo("statistics");
        }
    });
});
