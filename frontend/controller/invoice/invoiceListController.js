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
   ["$scope", "Invoice", "Dialog", function($scope, Invoice, Dialog) {
       $scope.invoices;

       // Filter
       $scope.showFilterPanel = false;
       $scope.filter = {
           string: ""
       };

       // Sort
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
        * Inform the user about workload.
        */
       $scope.informUser = function() {
           Dialog.autoCloseBox(
               "Bitte warten!",
               "Die Rechnung wird erzeugt, es wird um Geduld gebeten...",
               5000
           );
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

       $scope.getInvoices();
   }]);
 })();
