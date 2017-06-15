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
            add: function() {
                //TODO: implement add function
            },
            list: function() {
                return $http.get("/cash-earnings");
            },
            delete: function() {
                //TODO: implement delete function
            }
        };
    });
})();
