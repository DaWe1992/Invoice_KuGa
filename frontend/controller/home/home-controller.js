/**
 * Created by Daniel on 15.06.2017.
 * This file contains the Home module.
 */

"use strict";

(function() {

  /**
   * Initialize the module Home.
   * @type {IModule}
   */
  var module = angular.module("Home", []);

  /**
   * InvoiceListController.
   * This controller is responsible for
   * the home page.
   */
  module.controller("HomeController",
  ["$scope", "Session", "Dialog", function($scope, Session, Dialog) {
      $scope.userName;
      $scope.currDate = getDate();
      $scope.currTime = getTime();

      Session.userName(function(name) {
          $scope.userName = name;
      });

      /**
       * Gets the current date.
       */
      function getDate() {
          var d = new Date();
          return ((d.getDate() < 10) ? ("0" + d.getDate()) : (d.getDate())) + "." +
            ((d.getMonth() < 10) ? ("0" + d.getMonth()) : (d.getMonth())) +
            "." + d.getFullYear();
      }

      /**
       * Gets the current time.
       */
      function getTime() {
          var d = new Date();
          return ((d.getHours() < 10) ? ("0" + d.getHours()) : (d.getHours())) + ":" +
            ((d.getMinutes() < 10) ? ("0" + d.getMinutes()) : (d.getMinutes()));
      }
  }]);
})();
