/**
 * Created by Daniel on 04.08.2016.
 * This file contains the main module.
 */

"use strict";

(function() {

    /**
     * Initialize the module main.
     * @type {IModule}
     */
    var module = angular.module("main", []);

    /**
     * MainController.
     * This controller is responsible for
     * the navigation.
     */
    module.controller("MainController",
    ["$scope", "Dialog", "Session", function($scope, Dialog, Session) {

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
         * @param sel_tab_id
         */
        $scope.switchTab = function(sel_tab_id) {
            $(".navbar-left li").each(function() {
                if($(this).attr("id") === sel_tab_id) {
                    $(this).addClass("active");
                } else {
                    $(this).removeClass("active");
                }
            });
        }
    }]);
})();