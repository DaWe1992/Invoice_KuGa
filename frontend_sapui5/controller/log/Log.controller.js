/**
 * Log controller.
 * 19.08.2017
 *
 * @author Daniel Wehner
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
sap.ui.define([
    "com/danielwehner/invoicekuga/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "com/danielwehner/invoicekuga/service/LogService",
], function(BaseController, JSONModel, Filter, FilterOperator, LogService) {
    "use strict";

    var self;

    return BaseController.extend("com.danielwehner.invoicekuga.controller.log.Log", {

        /**
         * onInit function.
         * Gets all logs from the server.
         */
        onInit: function() {
            self = this;
            this._getLogs(function(data) {
                self.getView().setModel(
                    new JSONModel(data)
                );
            });
        },

        /**
         * Filters the list of alerts when clicking
         * on an IconTab.
         *
         * @param oEvent
         */
        onIconTabBarSelect: function(oEvent) {
            var oBinding = this.getView().byId("tableAlerts").getBinding("items");
            var sKey = oEvent.getParameter("key");
            var oFilter;

            // determine which icon has been selected
            // and filter accordingly
            switch(sKey) {
                case "Info":
                    oFilter = new Filter("status", FilterOperator.EQ, "INFO");
                    break;
                case "Warn":
                    oFilter = new Filter("status", FilterOperator.EQ, "WARN");
                    break;
                case "Erro":
                    oFilter = new Filter("status", FilterOperator.EQ, "ERRO");
                    break;
                default:
            }

            oBinding.filter(oFilter);
        },

        /**
         * Gets all logs from the server.
         *
         * @param fCallback
         */
        _getLogs: function(fCallback) {
            new LogService().getLogs(function(res) {
                fCallback(res.data);
            },
            function(res) {
                MessageBox.error(this.getTextById("Misc.error.data.load"));
            });
        }
    });
});
