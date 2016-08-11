/**
 * Created by Daniel on 27.07.2016.
 * This file is the main angular file which
 * is responsible for bootstrapping the angular application.
 */

"use strict";

(function() {

    /**
     * Initialize the InvoiceKuGa application.
     * @type {IModule}
     */
    var app = angular.module("InvoiceKuGa", [
        "main",
        "customerList",
        "customerDetail",
        "customerNew",
        "ngRoute",
        "ngAnimate",
        "ngDialog",
        "ngSanitize"
    ]);

    /**
     * Configure the routes for the application.
     */
    app.config(function($routeProvider) {
        $routeProvider
        .when("/customers", {
            templateUrl: "./view/customer/customer-list.html",
            controller: "CustomerListController"
        })
        .when("/customers/new", {
            templateUrl: "./view/customer/customer-new.html",
            controller: "CustomerNewController"
        })
        .when("/customers/:cu_id", {
            templateUrl: "./view/customer/customer-detail.html",
            controller: "CustomerDetailController"
        })
        /*.when("/customers/:cu_id/contacts/:co_id", {
            templateUrl: "",
            controller: ""
        })
        .when("/customers/:cu_id/contacts/new", {
            templateUrl: "",
            controller: ""
        })*/
        .otherwise({
            redirectTo: "/"
        });
    });

    /**
     * This code is executed as soon as
     * the application is running.
     */
    app.run(function($log) {
        $log.info("InvoiceKuGa app is running...");
    });
})();