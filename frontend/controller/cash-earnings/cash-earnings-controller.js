/**
 * Created by Daniel on 15.06.2017.
 * This file contains the CashEarnings module.
 */

"use strict";

(function() {

    /**
     * Initialize the module CashEarnings.
     * @type {IModule}
     */
    var module = angular.module("CashEarnings", []);

    /**
     * CashEarningsController.
     * This controller is responsible for the
     * cash earnings page.
     */
    module.controller("CashEarningsController",
    ["$scope", "$filter", "Dialog",
    function($scope, $filter, Dialog) {
        $scope.date;
        $scope.earnings = [
            {
                "date": "12.06.2017",
                "amount": "1266.70",
                "description": "Einnahme 1"
            },
            {
                "date": "13.06.2017",
                "amount": "1325.60",
                "description": "Einnahme 2"
            }
        ];

        // Format date "dd.MM.yyyy"
        $scope.$watch("date", function(newDate) {
            $scope.date = $filter("date")(newDate, "dd.MM.yyyy");
        });

        $scope.addCashEarning = function() {

        };
    }]);
})();
