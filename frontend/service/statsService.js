/**
 * Created by Daniel on 11.06.2017.
 * This file contains the stats service.
 */

 "use strict";

 (function() {

     /**
      * Get reference to InvoiceKuGa.
      * @type {IModule}
      */
     var module = angular.module("InvoiceKuGa");

     /**
      * Service for the stats.
      */
      module.factory("Stats", function StatsFactory($http, $routeParams) {
          return {
              getRevByMonth: function() {
                  return $http.get("/statistics/revbymonth");
              },
              getRevByCustomer: function() {
                  return $http.get("/statistics/revbycustomer");
              }
          };
      });
 })();
