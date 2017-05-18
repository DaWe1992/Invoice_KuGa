/**
 * Created by Daniel on 17.08.2016.
 * This file contains the invoiceList module.
 */

 "use strict";

 (function() {

   /**
    * Initialize the module invoiceList.
    * @type {IModule}
    */
   var module = angular.module("invoiceList", []);

   /**
    * InvoiceListController.
    * This controller is responsible for
    * the invoice list.
    */
   module.controller("InvoiceListController",
   ["$scope", "Invoice", function($scope, Invoice) {
       $scope.invoices;

       //filter
       $scope.showFilterPanel = false;
       $scope.filter = {
           string: ""
       };

       //sort
       $scope.propertyName = "id";
       $scope.reverse = false;

       /**
        * Gets the invoice list.
        */
       $scope.getInvoices = function() {
           Invoice.list().success(function(res) {
               $scope.invoices = res.data;
           })
           .error(function() {
               Dialog.errBox();
           });
       };

       /**
        * Toggles filter panel visibility.
        */
       $scope.toggleFilterPanel = function() {
           $scope.showFilterPanel = !$scope.showFilterPanel;
       };

       $scope.getInvoices();
   }]);
 })();
