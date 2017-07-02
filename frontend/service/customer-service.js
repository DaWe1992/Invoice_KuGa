/**
 * Created by Daniel on 06.08.2016.
 * This file contains the customer service.
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
    module.factory("Customer", function CustomerFactory($http, $routeParams) {
        return {
            add: function() {
                //TODO: implement add function
            },
            list: function() {
                return $http.get("/customers");
            },
            detail: function() {
                return $http.get("/customers/" + $routeParams.cu_id);
            },
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
            }
        };
    });
})();
