/**
 * Created by Daniel on 15.06.2017.
 * This file contains the cash earnings service.
 */

"use strict";

(function() {

    /**
     * Get reference to InvoiceKuGa.
     * @type {IModule}
     */
    var module = angular.module("InvoiceKuGa");

    /**
     * Service for the customers.
     */
    module.factory("CashEarnings", function CustomerFactory($http, $routeParams) {
        return {
            add: function(item) {
                return $http.post("/daily-cash-earnings", item);
            },
            list: function() {
                return $http.get("/daily-cash-earnings");
            },
            delete: function(id) {
                return $http.delete("/daily-cash-earnings/" + id);
            }
        };
    });
})();
