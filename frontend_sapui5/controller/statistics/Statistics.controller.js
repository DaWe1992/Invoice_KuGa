/**
 * StatisticsController.
 * 21.07.2017
 *
 * @author Daniel Wehner
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
sap.ui.define([
    "com/danielwehner/invoicekuga/controller/BaseController",
    "com/danielwehner/invoicekuga/service/StatisticsService",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function(BaseController, StatisticsService, JSONModel, MessageToast) {
    "use strict";

    var self;

    return BaseController.extend("com.danielwehner.invoicekuga.controller.statistics.Statistics", {

        /**
         * onInit function.
         */
        onInit: function() {
            self = this;
            var oView = this.getView();

            this._currentChart = "ceRev";

            // set settings model
            oView.setModel(
                new JSONModel({
                    "gridX": false,
                    "gridY": true,
                    "zoom": true,
                    "culling": 10
                }), "settings"
            );

            // update config object for charts
            this._updateConfig();
        },

        /**
         * Opens the dialog to select the statistics.
         */
        onOpenSelectStatisticsDialog: function() {
            this._openDialog(
                "SelectStatisticsDialog",
                "com.danielwehner.invoicekuga.fragment.SelectStatisticsDialog"
            );
        },

        /**
         * Closes the SelectStatisticsDialog and switches the chart.
         *
         * @param oEvent
         */
        onConfirmSelectStatisticsDialog: function(oEvent) {
            var sType = oEvent.getParameter("selectedItem").getProperty("info");
            MessageToast.show(this.getTextById("Misc.chart.switch") + sType);
            self._currentChart = sType;
            self.drawChart();
        },

        /**
         * Opens the chart settings dialog.
         */
        onOpenChartSettingsDialog: function() {
            this._openDialog(
                "ChartSettingsDialog",
                "com.danielwehner.invoicekuga.fragment.ChartSettingsDialog"
            );
        },

        /**
         * Saves the chart settings and closes the dialog.
         */
        onSaveChartSettings: function() {
            this._oChartSettingsDialog.close();
            this._updateConfig();
            this.drawChart();
        },

        /**
         * Opens the dialog specified
         *
         * @param sDialogType
         * @param sDialogName
         */
        _openDialog: function(sDialogType, sDialogName) {
            var oView = self.getView();

            var oDialog = (sDialogType === "SelectStatisticsDialog")
                ? this._oSelectStatisticsDialog
                : this._oChartSettingsDialog;

            // create dialog lazily
            if(!oDialog) {
                // create dialog via fragment factory
                oDialog = sap.ui.xmlfragment(
                    oView.getId(),
                    sDialogName,
                    self
                );

                // connect dialog to the root view of this component (models, lifecycle)
                oView.addDependent(oDialog);

                // forward compact/cozy style into dialog
                jQuery.sap.syncStyleClass(
                    oView.getController().getOwnerComponent().getContentDensityClass(), oView, oDialog
                );
            }

            if(sDialogType === "SelectStatisticsDialog") this._oSelectStatisticsDialog = oDialog;
            else this._oChartSettingsDialog = oDialog;

            oDialog.open();
        },

        /**
         * Decides which chart should be loaded.
         */
        drawChart: function() {
            var oPanel = this.getView().byId("chartPanel");

            switch(this._currentChart) {
                case "evtRevByMonth":
                    oPanel.setHeaderText(this.getTextById("Statistics.chart.evtRevByMonth.title"));
                    this._evtRevByMonth();
                    break;
                case "evtRevByCustomer":
                    oPanel.setHeaderText(this.getTextById("Statistics.chart.evtRevByCustomer.title"));
                    this._evtRevByCustomer();
                    break;
                case "ceRev":
                    oPanel.setHeaderText(this.getTextById("Statistics.chart.ceRev.title"));
                    this._ceRev();
                    break;
                default:
            }
        },

        /**
         * Updates the config object for the charts.
         */
        _updateConfig: function() {
            var oView = this.getView();

            // chart config data template
            this._config = {
                bindto: "#chart-area",
                data: {
                    columns: [],
                    colors: {}
                },
                grid: {
                    x: {show: oView.getModel("settings").getData().gridX},
                    y: {show: oView.getModel("settings").getData().gridY}
                },
                axis: {
                    x: {
                        type: "category",
                        categories: [],
                        tick: {
                            rotate: 20,
                            multiline: false,
                            culling: {
                                max: oView.getModel("settings").getData().culling
                            }
                        }
                    },
                    y: {
                        label: {
                            text: "",
                            position: "outer-middle"
                        }
                    }
                },
                zoom: {
                    enabled: oView.getModel("settings").getData().zoom
                }
            };
        },

        /**
         * Displays the event revenue by month
         */
        _evtRevByMonth: function() {

        },

        /**
         * Displays the event revenue by customer.
         */
        _evtRevByCustomer: function() {
            var config = $.extend(true, {}, this._config); // clone object
            config.data.types = {Revenue: "bar"};
            config.data.colors = {Revenue: "#0092D1"};
            config.data.names = {Revenue: this.getTextById("Statistics.chart.evtRevByCustomer.dataseries.name")};
            config.axis.y.label.text = this.getTextById("Statistics.chart.evtRevByCustomer.y.label");

            // get the data
            new StatisticsService().getEvtRevByCustomer(function(res) {
                var data = res.data.map(function(item, index) {
                    return item.evtrevenue;
                });

                data.unshift("Revenue");
                config.data.columns.push(data);

                // get labels for x-axis
                var categories = res.data.map(function(item, index) {
                    return item.firstname + " " + item.lastname;
                });

                config.axis.x.categories = categories;

                // generate graph
                c3.generate(config);
            }, function(res) {});
        },

        /**
         * Displays the cash earnings revenue.
         */
        _ceRev: function() {
            var config = $.extend(true, {}, this._config); // clone object
            config.data.types = {Revenue: "area-spline"};
            config.data.colors = {Revenue: "#0092D1"};
            config.data.names = {Revenue: this.getTextById("Statistics.chart.ceRev.dataseries.name")};
            config.axis.y.label.text = this.getTextById("Statistics.chart.ceRev.y.label");

            // Get the data
            new StatisticsService().getCeRev(function(res) {
                var data = res.data.map(function(item, index) {
                    return item.cerevenue;
                });

                data.unshift("Revenue");
                config.data.columns.push(data);

                // Get labels for x-axis
                var categories = res.data.map(function(item, index) {
                    return item.date;
                });

                config.axis.x.categories = categories;

                // Generate graph
                c3.generate(config);
            }, function(res) {});
        }
    });
});
