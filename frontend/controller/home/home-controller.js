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
      $scope.currDate = getDate();
      $scope.currTime = getTime();
      $scope.messages = [];

      var EnumLevel = {
          "INFO": "Info",
          "WARNING": "Warnung",
          "ERROR": "Fehler"
      }

      $scope.messages.push(createMessage(EnumLevel.INFO, "Sie sperren zur Zeit einen Datensatz! " +
      "<div class='pull-right'><a class='btn btn-xs btn-info' href='' ng-click=''>Freigeben</a></div><div class='clearfix'></div>"));
      $scope.messages.push(createMessage(EnumLevel.WARNING, "Warnung " + 2));
      $scope.messages.push(createMessage(EnumLevel.ERROR, "Fehler " + 3));
      $scope.messages.push(createMessage(EnumLevel.INFO, "Info " + 1));
      $scope.messages.push(createMessage(EnumLevel.WARNING, "Warnung " + 2));
      $scope.messages.push(createMessage(EnumLevel.ERROR, "Fehler " + 3));
      $scope.messages.push(createMessage(EnumLevel.INFO, "Info " + 1));
      $scope.messages.push(createMessage(EnumLevel.WARNING, "Warnung " + 2));
      $scope.messages.push(createMessage(EnumLevel.ERROR, "Fehler " + 3));

      /**
       * Create a message object.
       * @param level (message level; INFO, WARNING, ERROR)
       * @param msg (message text)
       * @return message object
       */
      function createMessage(level, msg) {
          return {
              "level": level,
              "msg": msg
          };
      }

      /**
       * Gets the current date.
       * @return current date with format dd.MM.yyyy
       */
      function getDate() {
          var d = new Date();
          return ((d.getDate() < 10) ? ("0" + d.getDate()) : (d.getDate())) + "." +
            ((d.getMonth() < 10) ? ("0" + d.getMonth()) : (d.getMonth())) +
            "." + d.getFullYear();
      }

      /**
       * Gets the current time.
       * @return current time with format hh:mm
       */
      function getTime() {
          var d = new Date();
          return ((d.getHours() < 10) ? ("0" + d.getHours()) : (d.getHours())) + ":" +
            ((d.getMinutes() < 10) ? ("0" + d.getMinutes()) : (d.getMinutes()));
      }
  }]);
})();
