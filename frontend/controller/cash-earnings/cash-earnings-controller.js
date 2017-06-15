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
    ["$scope", "$filter", "CashEarnings", "Dialog",
    function($scope, $filter, CashEarnings, Dialog) {
        $scope.date;
        $scope.earnings;

        // Format date "dd.MM.yyyy"
        $scope.$watch("date", function(newDate) {
            $scope.date = $filter("date")(newDate, "dd.MM.yyyy");
        });

        /**
         * Gets all cash earnings.
         */
        $scope.getCashEarnings = function() {
            CashEarnings.list().success(function(res) {
                $scope.earnings = res.data;
            })
            .error(function() {
                Dialog.errBox();
            });
        };

        $scope.addCashEarning = function() {

        };

        $scope.getCashEarnings();
    }]);
})();
