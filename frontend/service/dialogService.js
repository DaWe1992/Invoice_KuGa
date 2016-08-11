/**
 * Created by Daniel on 07.08.2016.
 * This file contains the dialog service.
 */

"use strict";

(function() {

    /**
     * Get reference to InvoiceKuGa.
     * @type {IModule}
     */
    var module = angular.module("InvoiceKuGa");

    /**
     * Service for the dialogs.
     */
    module.factory("Dialog", function DialogService($rootScope, ngDialog) {
        return {

            /**
             * Displays a confirm box.
             * @param title (title of the dialog)
             * @param body (body text of the dialog)
             * @param yesOption (function to be executed when "yes" is clicked)
             * @param noOption (function to be executed when "no" is clicked)
             * @returns {*}
             */
            confirmBox: function(title, body, yesOption, noOption) {
                var scope = $rootScope.$new(true);
                
                scope.title = title;
                scope.body = body;
                
                scope.yesOption = function() {
                    yesOption();
                    ngDialog.close();
                };
                
                scope.noOption = function() {
                    if(noOption) noOption();
                    ngDialog.close();
                };

                return ngDialog.openConfirm({
                    template: "../fragment/dialog/confirm-dialog.html",
                    className: "ngdialog-theme-default",
                    scope: scope
                });
            },

            /**
             * Displays a simple message box.
             * @param title (title of the dialog)
             * @param body (body text of the dialog)
             * @returns {Window|*}
             */
            msgBox: function(title, body) {
                var scope = $rootScope.$new(true);

                scope.title = title;
                scope.body = body;
                
                scope.okOption = function() {
                    ngDialog.close();
                };
                
                return ngDialog.open({
                    template: "../fragment/dialog/msg-dialog.html",
                    className: "ngdialog-theme-default",
                    scope: scope
                });
            },

            /**
             * Displays a general error popup.
             * @returns {Window|*}
             */
            errBox: function() {
                var scope = $rootScope.$new(true);

                scope.title = "Fehler :'(";
                scope.body = "Bei der Verarbeitung ist ein Fehler aufgetreten. " +
                "Bitte versuchen Sie es später erneut. Falls das Problem weiterhin besteht, " +
                "wenden Sie sich bitte an <b>daniel.wehner92@gmx.de</b> bzw. <b>0160/8292152</b>.";

                scope.okOption = function() {
                    ngDialog.close();
                };

                return ngDialog.open({
                    template: "../fragment/dialog/msg-dialog.html",
                    className: "ngdialog-theme-default",
                    scope: scope
                });
            }
        };
    });
})();
