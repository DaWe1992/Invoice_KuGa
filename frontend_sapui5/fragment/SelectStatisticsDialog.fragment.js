sap.ui.jsfragment("com.danielwehner.invoicekuga.fragment.SelectStatisticsDialog", {

    /**
     * Creates the content of the fragment.
     */
    createContent: function(oController) {
        return [
            new sap.m.SelectDialog({
                confirm: oController.onConfirmSelectStatisticsDialog,
                title: "Select Chart",
                items: [
                    new sap.m.StandardListItem({
                        title: "Event Revenue by Month",
            			description: "Shows the event revenue clustered by months.",
                        info: "evtRevByMonth",
            			icon: "sap-icon://bar-chart",
            			iconDensityAware: false,
            			iconInset: false,
            			type: "Active"
                    }),
                    new sap.m.StandardListItem({
                        title: "Event Revenue by Customer",
            			description: "Shows the event revenue clustered by customers.",
                        info: "evtRevByCustomer",
            			icon: "sap-icon://bar-chart",
            			iconDensityAware: false,
            			iconInset: false,
            			type: "Active"
                    }),
                    new sap.m.StandardListItem({
                        title: "Cash Earnings Revenue",
            			description: "Shows the daily cash earnings revenue.",
                        info: "ceRev",
            			icon: "sap-icon://area-chart",
            			iconDensityAware: false,
            			iconInset: false,
            			type: "Active"
                    })
                ]
            })
        ];
    }
});
