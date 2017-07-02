/**
 * Created by Daniel on 28.07.2016.
 * This file contains the CustomerList module.
 */

"use strict";

(function() {

    /**
     * Initialize the module CustomerList.
     * @type {IModule}
     */
    var module = angular.module("CustomerList", []);

    /**
     * CustomerListController.
     * This controller is responsible for
     * the customer list.
     */
    module.controller("CustomerListController",
    ["$scope", "Customer", function($scope, Customer) {
        $scope.customers;

        // Filter
        $scope.showFilterPanel = false;
        $scope.filter = {
            string: ""
        };

        // Sort
        $scope.propertyName = "id";
        $scope.reverse = false;

        /**
         * Gets the customer list.
         */
        $scope.getCustomers = function() {
            Customer.list().success(function(res) {
                $scope.customers = res.data;
            })
            .error(function(res) {
                Dialog.errBox(res.err);
            });
        };

        /**
         * Deletes the customer specified
         * with the id param.
         * @param id
         */
        $scope.deleteCustomer = function(id) {

        };

        /**
         * Toggles filter panel visibility.
         */
        $scope.toggleFilterPanel = function() {
            $scope.showFilterPanel = !$scope.showFilterPanel;
        };

        /**
         * Resets the filter string.
         */
        $scope.deleteFilter = function() {
            $scope.filter.string = "";
        };

        /**
         * Sorts the customers table.
         * @param propertyName
         */
        $scope.sortBy = function(propertyName) {
            $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
        };

        $scope.getCustomers();
    }]);
})();
