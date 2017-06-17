/**
 * Created by Daniel on 06.08.2016.
 * This file contains the session service.
 */

"use strict";

(function() {

    /**
     * Get reference to InvoiceKuGa.
     * @type {IModule}
     */
    var module = angular.module("InvoiceKuGa");

    /**
     * Service for the sessions.
     */
    module.factory("Session", function SessionFactory($http) {
        return {
            logout: function() {
                return $http.post("/logout");
            },
            user: function() {
                return $http.get("/me");
            },
            userName: function(callback) {
                $http.get("/me").success(function(res) {
                    callback(res.account.givenName);
                });
            },
            fullName: function(callback) {
                $http.get("/me").success(function(res) {
                    callback(res.account.fullName);
                });
            }
        };
    });
})();
