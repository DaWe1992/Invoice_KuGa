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
    ["$scope", "$filter", "$log", "CashEarnings", "Dialog",
    function($scope, $filter, $log, CashEarnings, Dialog) {
        $scope.date;
        $scope.amount;
        $scope.description;
        $scope.earnings;

        // Format date "dd.MM.yyyy"
        $scope.$watch("date", function(newDate) {
            $scope.date = $filter("date")(newDate, "yyyy-MM-dd");
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

        /**
         * Adds a new cash earning,
         * which is saved in the $scope.new variable.
         */
        $scope.addCashEarning = function() {
            CashEarnings.add({
                "date": $scope.date,
                "amount": $scope.amount,
                "description": $scope.description
            })
            .success(function(res) {
                $log.info(res.data.rows[0]);
                $scope.earnings.push(res.data.rows[0]);
            })
            .error(function() {
                Dialog.errBox();
            });
        };

        $scope.getCashEarnings();
    }]);
})();
