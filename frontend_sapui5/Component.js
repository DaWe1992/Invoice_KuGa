/**
 * Main Component of the App.
 * 03.07.2017
 *
 * @author Daniel Wehner
 */
sap.ui.define([
    "sap/ui/core/UIComponent"
], function(UIComponent) {
    "use strict";

    return UIComponent.extend("com.danielwehner.invoicekuga.Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);
			
			// initialize router
			// create the views based on the url/hash
			this.getRouter().initialize();
        }
    });
});
