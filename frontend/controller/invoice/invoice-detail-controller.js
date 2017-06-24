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

       $scope.getInvoice = function() {
           Invoice.detail().success(function(res) {
               $scope.invoice = res.data.invoice;
               $scope.customer = res.data.customer;
           })
           .error(function(err) {
               Dialog.errBox();
           });
       };

       $scope.getInvoice();
   }]);
 })();
