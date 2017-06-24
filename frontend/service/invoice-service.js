/**
 * Created by Daniel on 18.05.2017.
 * This file contains the invoice service.
 */

"use strict";

(function() {

    /**
     * Get reference to InvoiceKuGa.
     * @type {IModule}
     */
    var module = angular.module("InvoiceKuGa");

    /**
     * Service for the invoices.
     */
    module.factory("Invoice", function InvoiceFactory($http, $routeParams) {
        return {
            add: function() {
                //TODO: implement add function
            },
            list: function() {
                return $http.get("/invoices");
            },
            detail: function() {
                return $http.get("/invoices/" + $routeParams.inv_id);
            }/*,
            delete: function() {
                //TODO: implement delete function
            },
            isLocked: function() {
                return $http.get("/customers/" + $routeParams.cu_id + "/islocked");
            },
            lock: function() {
                return $http.post("/customers/" + $routeParams.cu_id + "/lock");
            },
            unlock: function() {
                return $http.post("/customers/" + $routeParams.cu_id + "/unlock");
            }*/
        };
    });
})();
