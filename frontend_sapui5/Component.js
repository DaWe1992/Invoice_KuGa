/**
 * Main Component of the App.
 * 03.07.2017
 *
 * @author Daniel Wehner
 */
sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], function(UIComponent, JSONModel, Device) {
    "use strict";

    return UIComponent.extend("com.danielwehner.invoicekuga.Component", {

        metadata: {
            manifest: "json"
        },

        /**
         * init function.
         * Initializes the router and sets the
         * device model.
         */
        init: function () {
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);

            // set device model
            var oDeviceModel = new JSONModel(Device);
            oDeviceModel.setDefaultBindingMode("OneWay");
            this.setModel(oDeviceModel, "device");

			// initialize router
			// create the views based on the url/hash
			this.getRouter().initialize();
        },

        /**
         * Determines the content density class.
         * If the current device supports touch then
         * the cozy mode is used else the compact mode is used.
         */
        getContentDensityClass: function() {
            if(!this._sContentDensityClass) {
                if(!Device.support.touch) {
                    this._sContentDensityClass = "sapUiSizeCompact";
                } else {
                    this._sContentDensityClass = "sapUiSizeCozy";
                }
            }
            return this._sContentDensityClass;
        }
    });
});
