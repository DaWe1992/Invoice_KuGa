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

        $scope.earnings = [];

        $scope.new = {
            "date": "",
            "amount": "",
            "description": ""
        };

        // Format date "yyyy-MM-dd" in input form
        $scope.$watch(function($scope) {
            return $scope.new.date;
        }, function(newDate) {
            $scope.new.date = $filter("date")(newDate, "yyyy-MM-dd");
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
            if(!$scope.new.description) $scope.new.description = "";
            CashEarnings.add($scope.new).success(function(res) {
                $scope.new.date = "";
                $scope.new.amount = "";
                $scope.new.description = "";
                $scope.earnings.push(res.data.rows[0]);
            })
            .error(function() {
                Dialog.errBox();
            });
        };

        /**
         * Deletes a cash earning by id.
         * @param id
         */
        $scope.deleteCashEarning = function(id) {
            Dialog.confirmBox(
                "Einnahme löschen?",
                "Möchten Sie diese Einnahme wirklich unwiderruflich löschen?",
                function() { //yesOption
                    CashEarnings.delete(id).success(function(res) {
                        // Delete cash earning from array
                        var array = $scope.earnings.map(function(earning) {
                            return earning.id;
                        });
                        var index = array.indexOf(id);

                        $scope.earnings.splice(index, 1);
                    })
                    .error(function() {
                        Dialog.errBox();
                    });
                }
            )
        };

        $scope.getCashEarnings();
    }]);
})();
