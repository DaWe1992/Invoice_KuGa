/**
 * Created by Daniel on 06.08.2016.
 * This file contains the CustomerDetail module.
 */

"use strict";

(function() {

    /**
     * Initialize the module CustomerDetail.
     * @type {IModule}
     */
    var module = angular.module("CustomerDetail", []);

    /**
     * CustomerDetailController.
     * This controller is responsible for the
     * customer detail page.
     */
    module.controller("CustomerDetailController",
    ["$scope", "Customer", "Session", "Dialog",
    function($scope, Customer, Session, Dialog) {
        $scope.customer;
        $scope.contacts;
        $scope.readOnly = true;

        /**
         * Gets customer detail data.
         * The id of the customer is read from the URL.
         */
        $scope.getCustomer = function() {
            Customer.detail().success(function(res) {
                $scope.customer = res.data.customer;
                $scope.contacts = res.data.contacts;
            })
            .error(function() {
                Dialog.errBox();
            });
        };

        /**
         * Determins the initial mode.
         * readOnly = false or readOnly = true.
         */
        $scope.determineInitMode = function() {
            var user;

            Customer.isLocked().success(function(res) {
                if(res.data) {
                    user = res.data.email;
                    Session.user().success(function(res) {
                        if(res.account.email === user) $scope.readOnly = false;
                    })
                    .error(function() {
                        Dialog.errBox();
                    });
                }
            })
            .error(function() {
                Dialog.errBox();
            });
        };

        /**
         * Toggles read/write mode
         */
        $scope.toggleReadWrite = function() {
            if($scope.readOnly) {
                Customer.isLocked().success(function(res) {
                    if(res.data) {
                        Dialog.msgBox(
                            "Datensatz gesperrt",
                            "Dieser Datensatz wird gerade von <b>" + res.data.user +
                            "</b> bearbeitet und ist deshalb gesperrt."
                        );
                    } else {
                        Customer.lock().success(function() {
                            $scope.readOnly = false;
                        })
                        .error(function() {
                            Dialog.errBox();
                        });
                    }
                })
                .error(function() {
                    Dialog.errBox();
                });
            } else {
                Customer.unlock().success(function() {
                    $scope.readOnly = true;
                })
                .error(function() {
                    Dialog.errBox();
                });
            }
        };

        /**
         * Deletes a contact by its id.
         * @param id
         */
        $scope.deleteContact = function(id) {
            //TODO: implement function to delete a customer contact
        };

        $scope.getCustomer();
        $scope.determineInitMode();
    }]);
})();
