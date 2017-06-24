/**
 * Created by Daniel on 04.08.2016.
 * This file contains the Main module.
 */

"use strict";

(function() {

    /**
     * Initialize the module main.
     * @type {IModule}
     */
    var module = angular.module("Main", []);

    /**
     * MainController.
     * This controller is responsible for
     * the navigation.
     */
    module.controller("MainController",
    ["$scope", "Dialog", "Session", function($scope, Dialog, Session) {

        // Current user
        $scope.user;

        $scope.year = new Date().getFullYear();

        /**
         * Shows the dialog.
         */
        $scope.showPopup = function() {
            Dialog.confirmBox(
                "Abmeldung",
                "Möchten Sie sich wirklich abmelden?",
                function() { //yesOption
                    Session.logout().success(function() {
                        location.reload();
                    })
                }
            );
        };

        /**
         * Adds the .active class to the selected tab
         * and removes the class if another tab is selected.
         * @param items
         * @param sel_item_id
         */
        $scope.switch = function(items, sel_item_id) {
            $(items === "nav" ? ".navbar-left li" : ".nav-pills li").each(function() {
                if($(this).attr("id") === sel_item_id) {
                    $(this).addClass("active");
                } else {
                    $(this).removeClass("active");
                }
            });
        };

        // Load current user
        Session.user().success(function(res) {
            $scope.user = res.account;
        });
    }]);
})();
