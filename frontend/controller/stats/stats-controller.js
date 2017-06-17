/**
 * Created by Daniel on 21.08.2016.
 * This file contains the statistics module.
 */

"use strict";

(function() {

    /**
     * Initialize the module statistics.
     * @type {IModule}
     */
    var module = angular.module("Statistics", []);

    /**
     * StatsController.
     * This controller is responsible for
     * displaying statistics on the screen.
     */
    module.controller("StatsController",
    ["$scope", "Stats", function($scope, Stats) {

        $scope.chart = null;

        $scope.title = "Bitte Statistik auswählen...";

        // Create default configuration for the charts
        $scope.config = {
            bindto: "#chartArea",
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

        /**
         * Creates chart that shows the event revenues
         * by months.
         */
        $scope.showChartEvtRevByMonth = function() {
            $scope.title = "Umsatz nach Monaten";
            var config = $.extend(true, {}, $scope.config); // Clone object
            config.data = {
                columns: [
                    ["Umsatz", 30, 200, 100, 400, 150, 250],
                    ["Gewinn", 50, 20, 10, 40, 15, 25]
                ],
                axes: {Gewinn: "y2"},
                types: {
                    Umsatz: "area-spline",
                    Gewinn: "bar"
                }
            };

            // Generate graph
            c3.generate(config);
        };

        /**
         * Creates chart that shows the event revenues
         * by customers.
         */
        $scope.showChartEvtRevByCustomer = function() {
            $scope.title = "Umsatz nach Kunden (Veranstaltungen)";

            var config = $.extend(true, {}, $scope.config); // Clone object
            config.data.types = {Umsatz: "bar"};
            config.data.colors = {Umsatz: "#ffa600"};
            config.axis.y.label.text = "Umsatz in €";

            // Get the data
            Stats.getEvtRevByCustomer().success(function(res) {
                var data = res.data.map(function(item, index) {
                    return item.evtrevenue;
                });

                data.unshift("Umsatz");
                config.data.columns.push(data);

                // Get labels for x-axis
                var categories = res.data.map(function(item, index) {
                    return item.firstname + " " + item.lastname;
                });

                config.axis.x.categories = categories;

                // Generate graph
                c3.generate(config);
            })
            .error(function() {
                Dialog.errBox();
            });
        };

        /**
         * Creates chart that shows the
         * cash earnings revenues.
         */
        $scope.showChartCeRev = function() {
            $scope.title = "Umsatz Kasseneinnahmen";

            var config = $.extend(true, {}, $scope.config); // Clone object
            config.data.types = {Umsatz: "area-spline"};
            config.data.colors = {Umsatz: "#ffa600"};
            config.axis.y.label.text = "Umsatz in €";

            // Get the data
            Stats.getCeRev().success(function(res) {
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
            })
            .error(function() {
                Dialog.errBox();
            });
        };
    }]);
})();
