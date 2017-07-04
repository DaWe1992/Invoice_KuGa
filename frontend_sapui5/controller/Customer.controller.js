/**
 * Customer controller.
 * 04.07.2017
 * @author Daniel Wehner
 */
 sap.ui.define([
     "sap/ui/core/mvc/Controller",
 	"sap/m/MessageToast",
     "jquery.sap.global"
 ], function(Controller, MessageToast, jQuery) {
     "use strict";

 	return Controller.extend("com.danielwehner.invoicekuga.controller.Customer", {

         onAfterRendering: function() {
             var oSplitCont = this.getSplitContObj()
             var ref = oSplitCont.getDomRef() && oSplitCont.getDomRef().parentNode;

             // set all parent elements to 100% height
             if(ref && !ref._sapui5_heightFixed) {
                 ref._sapui5_heightFixed = true;

                 while(ref && ref !== document.documentElement) {
                     var $ref = jQuery(ref);

                     if($ref.attr("data-sap-ui-root-content")) {
                         break;
                     }

                     if(!ref.style.height) {
                         ref.style.height = "100%";
                     }
                     ref = ref.parentNode;
                 }
             }
         },

         onPressNavToDetail: function(oEvent) {
             this.getSplitContObj().to(this.createId("detailDetail"));
         },

         onListItemPress: function(oEvent) {
             var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();
             this.getSplitContObj().toDetail(this.createId(sToPageId));
         },

         getSplitContObj: function() {
             var result = this.byId("SplitContDemo");
             if(!result) {
                 jQuery.sap.log.error("SplitApp object can't be found");
             }
             return result;
         }
     });
 });
