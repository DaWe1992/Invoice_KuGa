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
    var module = angular.module("statistics", []);

    /**
     * StatsController.
     * This controller is responsible for
     * displaying statistics on the screen.
     */
    module.controller("StatsController", ["$scope", function($scope) {
        $scope.chart = c3.generate({
            bindto: "#chart",
            data: {
                columns: [
                    ["Umsatz", 30, 200, 100, 400, 150, 250],
                    ["Gewinn", 50, 20, 10, 40, 15, 25]
                ],
                axes: {Gewinn: "y2"},
                types: {
                    Umsatz: "area-spline",
                    Gewinn: "bar"
                }
            },
            grid: {
                x: {show: false},
                y: {show: true}
            },
            axis: {
                y: {
                    label: {
                        text: "Y Label",
                        position: "outer-middle"
                    }
                },
                y2: {
                    show: true,
                    label: {
                        text: "Y2 Label",
                        position: "outer-middle"
                    }
                }
            },
            zoom: {
                enabled: true
            }
        });
    }]);
})();
