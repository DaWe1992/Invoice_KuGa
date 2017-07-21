sap.ui.jsview("com.danielwehner.invoicekuga.view.statistics.Statistics", {

    /**
     * Gets the controller for the view.
     *
     * @return
     */
    getControllerName : function() {
        return "com.danielwehner.invoicekuga.controller.statistics.Statistics";
    },

    /**
     * Creates the view content.
     *
     * @param oController
     * @return
     */
    createContent : function(oController) {
        return [
            new sap.m.Page({
                title: "Statistics",
                height: "100%",
                content: new sap.m.Panel({
                    headerText: "Daily Cash Earnings Revenue",
                    backgroundDesign: "Solid",
                    content: new sap.ui.core.HTML("html", {
                        content: "<div id=\"chart-area\" style=\"width: 95%; height: 500px;\"></div>",
                        preferDOM: false,
                        afterRendering: function(e) {
                            oController.drawChart("ceRev");
                        }
                    })
                }),
                headerContent: new sap.m.Button({
                    press: oController.onOpenSelectStatisticsDialog,
                    icon: "sap-icon://action-settings"
                })
            }).addStyleClass("sapUiContentPadding")
        ];
    }
});
