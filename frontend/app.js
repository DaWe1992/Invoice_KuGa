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
        "Main",
        "Home",
        "CustomerList",
        "CustomerDetail",
        "CustomerNew",
        "InvoiceList",
        "InvoiceDetail",
        "CashEarnings",
        "Statistics",
        "ngRoute",
        "ngAnimate",
        "ngDialog",
        "ngSanitize",
        "angular.filter",
        "ui.bootstrap.datetimepicker"
    ]);

    /**
     * Configure the routes for the application.
     */
    app.config(function($routeProvider) {
        $routeProvider
        .when("/", {
            templateUrl: "./view/home/home.html",
            controller: "HomeController"
        })
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
        .when("/invoices", {
            templateUrl: "./view/invoice/invoice-list.html",
            controller: "InvoiceListController"
        })
        .when("/invoices/:inv_id", {
            templateUrl: "./view/invoice/invoice-detail.html",
            controller: "InvoiceDetailController"
        })
        .when("/daily-cash-earnings", {
            templateUrl: "./view/cash-earnings/cash-earnings.html",
            controller: "CashEarningsController"
        })
        .when("/statistics", {
            templateUrl: "./view/stats/statistics.html",
            controller: "StatsController"
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
     * Format numbers as percentages.
     */
    app.filter("percentage", ["$filter", function($filter) {
        return function(input, decimals) {
            var percentage = $filter("number")(input * 100, decimals);
            percentage = percentage.toString().replace(/(\.[0-9]*?)0+$/, "$1").replace(/\.$/, "");
            return percentage + " %";
        };
    }]);

    /**
     * This code is executed as soon as
     * the application is running.
     */
    app.run(function($log) {
        $log.info("InvoiceKuGa app is running...");
    });
})();
