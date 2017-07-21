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
    "sap/m/MessageToast"
], function(BaseController, StatisticsService, MessageToast) {
    "use strict";

    var self;

    return BaseController.extend("com.danielwehner.invoicekuga.controller.statistics.Statistics", {

        /**
         * onInit function.
         */
        onInit: function() {
            self = this;

            // chart config data template
            this.config = {
                bindto: "#chart-area",
                data: {
                    columns: [],
                    colors: {}
                },
                grid: {
                    x: {show: false},
                    y: {show: true}
                },
                axis: {
                    x: {
                        type: "category",
                        categories: [],
                        tick: {
                            rotate: 20,
                            multiline: false,
                            culling: {
                                max: 10
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
                    enabled: true
                }
            };
        },

        /**
         * Opens the dialog to select the statistics.
         */
        onOpenSelectStatisticsDialog: function() {
            var oView = self.getView();
            var oDialog = oView.byId("selectStatisticsDialog");

            // create dialog lazily
            if(!this._oDialog) {
                // create dialog via fragment factory
                this._oDialog = sap.ui.jsfragment(
                    oView.getId(),
                    "com.danielwehner.invoicekuga.fragment.SelectStatisticsDialog",
                    self
                );

                // connect dialog to the root view of this component (models, lifecycle)
                oView.addDependent(this._oDialog);

                // forward compact/cozy style into dialog
                jQuery.sap.syncStyleClass(
                    oView.getController().getOwnerComponent().getContentDensityClass(), oView, this._oDialog
                );
            }

            this._oDialog.open();
        },

        /**
         * Closes the SelectStatisticsDialog and switches the chart.
         *
         * @param oEvent
         */
        onConfirmSelectStatisticsDialog: function(oEvent) {
            this._oDialog.close();
            var sType = oEvent.getParameter("selectedItem").getProperty("info");
            MessageToast.show("Switched chart to: " + sType);
            self.drawChart(sType);
        },

        /**
         * Closes the SelectStatisticsDialog without any action.
         */
        onCloseSelectStatisticsDialog: function() {
            this._oDialog.close();
        },

        /**
         * Decides which chart should be loaded.
         *
         * @param sChartType
         */
        drawChart: function(sChartType) {
            switch(sChartType) {
                case "evtRevByMonth":
                    this._evtRevByMonth();
                    break;
                case "evtRevByCustomer":
                    this._evtRevByCustomer();
                    break;
                case "ceRev":
                    this._ceRev();
                    break;
                default:
            }

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
            var config = $.extend(true, {}, this.config); // clone object
            config.data.types = {Umsatz: "bar"};
            config.data.colors = {Umsatz: "#0092D1"};
            config.axis.y.label.text = "Umsatz in €";

            // get the data
            new StatisticsService().getEvtRevByCustomer(function(res) {
                var data = res.data.map(function(item, index) {
                    return item.evtrevenue;
                });

                data.unshift("Umsatz");
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
            var config = $.extend(true, {}, this.config); // clone object
            config.data.types = {Umsatz: "area-spline"};
            config.data.colors = {Umsatz: "#0092D1"};
            config.axis.y.label.text = "Umsatz in €";

            // Get the data
            new StatisticsService().getCeRev(function(res) {
                var data = res.data.map(function(item, index) {
                    return item.cerevenue;
                });

                data.unshift("Umsatz");
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
