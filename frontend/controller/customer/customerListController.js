/**
 * Created by Daniel on 28.07.2016.
 * This file contains the customerList module.
 */

"use strict";

(function() {

    /**
     * Initialize the module customerList.
     * @type {IModule}
     */
    var module = angular.module("customerList", []);

    /**
     * CustomerListController.
     * This controller is responsible for
     * the customer list.
     */
    module.controller("CustomerListController",
    ["$scope", "Customer", function($scope, Customer) {
        $scope.customers;

        //filter
        $scope.showFilterPanel = false;
        $scope.filter = {
            string: ""
        };

        //sort
        $scope.propertyName = "id";
        $scope.reverse = false;

        /**
         * Gets the customer list.
         */
        $scope.getCustomers = function() {
            Customer.list().success(function(res) {
                $scope.customers = res.data;
            })
            .error(function() {
                Dialog.errBox();
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
