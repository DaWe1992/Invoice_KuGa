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

       $scope.sums;

       $scope.getInvoice = function() {
           Invoice.detail().success(function(res) {
               $scope.invoice = res.data.invoice;
               $scope.customer = res.data.customer;
               $scope.getSums();
           })
           .error(function(err) {
               Dialog.errBox();
           });
       };

       $scope.getSums = function() {
           var sumNet = 0;
           var sumVat1 = 0; // 7%
           var sumVat2 = 0; // 19%
           var sumGross = 0;

           // loop over positions
           $scope.invoice.positions.forEach(function(pos) {
               sumNet += Number(pos.net);
               sumGross += Number(pos.gross);
               sumVat1 += (pos.vatrate === "0.07" ? Number(pos.vat) : 0);
               sumVat2 += (pos.vatrate === "0.19" ? Number(pos.vat) : 0);

               $scope.sums = {
                   net: sumNet,
                   gross: sumGross,
                   vat1: sumVat1,
                   vat2: sumVat2
               };
           });
       };

       $scope.getInvoice();
   }]);
 })();
