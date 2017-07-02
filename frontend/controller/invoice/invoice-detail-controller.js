/**
 * Created by Daniel on 17.08.2016.
 * This file contains the InvoiceDetail module.
 */

 "use strict";

 (function() {

   /**
    * Initialize the module InvoiceDetail.
    * @type {IModule}
    */
   var module = angular.module("InvoiceDetail", []);

   /**
    * InvoiceDetailController.
    * This controller is responsible for
    * the invoice detail page.
    */
   module.controller("InvoiceDetailController",
   ["$scope", "Invoice", "Dialog", function($scope, Invoice, Dialog) {
       $scope.invoice;
       $scope.customer;
       $scope.readOnly = true;

       $scope.newPos = {
           "pos": "",
           "qty": "",
           "unitprice": "",
           "vatrate": ""
       };

       /**
        * Gets the invoice detail data.
        * The id of the invoice is read from the URL.
        */
       $scope.getInvoice = function() {
           Invoice.detail().success(function(res) {
               $scope.invoice = res.data.invoice;
               $scope.customer = res.data.customer;
           })
           .error(function(res) {
               Dialog.errBox(res.err);
           });
       };

       /**
        * Adds a position to the invoice.
        * The id of the invoice is read from the URL.
        */
       $scope.addPos = function() {
           Invoice.addPos($scope.newPos).success(function(res) {
               $scope.newPos.pos = "";
               $scope.newPos.qty = "";
               $scope.newPos.unitprice = "";
               $scope.newPos.vatrate = "";
           })
           .error(function(res) {
               Dialog.errBox(res.err);
           });
       };

       /**
        * Toggles read/write mode.
        */
       $scope.toggleReadWrite = function() {
           $scope.readOnly = !$scope.readOnly;
       };

       $scope.getInvoice();
   }]);
 })();
