/**
 * App controller.
 * 04.07.2017
 * @author Daniel Wehner
 */
sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
    "use strict";

    return Controller.extend("com.danielwehner.invoicekuga.controller.App", {

        /**
         * Toggles side bar navigation.
         */
        onSideNavButtonPress: function() {
            var viewId = this.getView().getId();
            var toolPage = sap.ui.getCore().byId(viewId + "--toolPage");
            var sideExpanded = toolPage.getSideExpanded();

			toolPage.setSideExpanded(!toolPage.getSideExpanded());
        }
    });
});
