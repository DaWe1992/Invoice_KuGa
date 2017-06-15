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

        // Create configuration for the charts

        // Initialize emptry config object
        $scope.config = {};

        $scope.config.data = {
            columns: []
        };

        // Grid config
        $scope.config.grid = {
            x: {show: false},
            y: {show: true}
        };

        // Axis config
        $scope.config.axis = {
            x: {
                type: "category",
                categories: []
            },
            y: {
                label: {
                    text: "Y Label",
                    position: "outer-middle"
                }
            }
        };

        // Zoom config
        $scope.config.zoom = {
            enabled: true
        };

        // Binding
        $scope.config.bindto = "#chartArea";

        $scope.title = "Bitte Statistik auswählen...";

        /**
         * Create chart that shows the event revenues
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
         * Create chart that shows the event revenues
         * by customers.
         */
        $scope.showChartEvtRevByCustomer = function() {
            $scope.title = "Umsatz nach Kunden";
            var config = $.extend(true, {}, $scope.config); // Clone object
            config.data.types = {
                Umsatz: "bar"
            };

            // Get the data
            Stats.getRevByCustomer().success(function(res) {
                var data = res.data.map(function(item, index) {
                    return item.evtrevenue;
                });

                data.unshift("Umsatz");
                config.data.columns.push(data);

                // Get labels for x-axis
                var categories = res.data.map(function(item, index) {
                    return item.cust_firstname + " " + item.cust_lastname;
                });

                config.axis.x.categories = categories;
                config.axis.y.label.text = "Umsatz in €";

                // Generate graph
                c3.generate(config);
            })
            .error(function() {
                Dialog.errBox();
            });
        };
    }]);
})();
