/**
 * Customer controller.
 * 04.07.2017
 *
 * @author Daniel Wehner
 */
 sap.ui.define([
	"com/danielwehner/invoicekuga/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "com/danielwehner/invoicekuga/service/CustomerService",
    "sap/m/MessageBox"
], function(BaseController, JSONModel, Filter, FilterOperator, CustomerService, MessageBox) {
    "use strict";

    var self;

 	return BaseController.extend("com.danielwehner.invoicekuga.controller.customer.Customer", {

		/**
		 * onInit function.
         * Loads the customer data (customer list) and registers
         * the navigation event listener
         * which is triggered when a list item is pressed.
		 */
		onInit: function() {
            self = this;
            var oView = this.getView();

            // load customer list data
            this._getCustomers(function(data) {
                var oModel = new JSONModel(data);
                oView.setModel(oModel);
            });

            // get reference to detail page
			var oDetailPage = this.byId("splitContainer").getDetailPages()[1];

			oDetailPage.addEventDelegate({

                /**
                 * Loads the customer detail data
                 * and creats a JSONModel before the detail page
                 * is shown.
                 */
				onBeforeShow: function(oEvent) {
                    self._getCustomer(oEvent.data.id, function(data) {
                        var oModel = new JSONModel(data); // store the data
    					oDetailPage.setModel(oModel);
                    });
				}
			});

            // make the save button visible
            this.getEvtBus().subscribe("channelNewCustomer", "wizardFinished", function() {
                var oSaveButton = oView.byId("btnSaveNewCustomer");
                oSaveButton.setVisible(true);
            }, this);
		},

		/**
		 * Searches for a customer in the customer list.
		 *
		 * @param oEvent
		 */
		onSearch: function(oEvent) {
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();

			// create the filter
			if(sQuery && sQuery.length > 0) {
				var filter = new Filter({
                    filters: [
                        new Filter("firstname", FilterOperator.Contains, sQuery),
                        new Filter("lastname", FilterOperator.Contains, sQuery)
                    ],
                    and: false
                });
				aFilters.push(filter);
			}

			// apply the filter
			var list = this.getView().byId("customerList");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},

        /**
		 * Displays the detail data of the customer.
         * If the detail view currently is not displayed the
		 * split container first navigates to that page else it simply updates the detail view with the new data.
         *
		 * @param oEvent
		 */
        onItemPress: function(oEvent) {
            // get the data of the item pressed
            var sPath = oEvent.getSource().getBindingContext().getPath();
            var oData = this.getView().getModel().getProperty(sPath);

            // determine the current detail page
            var oSplitContainer = this.getView().byId("splitContainer");
            var oCurrentDetailPage = oSplitContainer.getCurrentDetailPage();

            // determine which page is currently displayed and continue accordingly
            if(oCurrentDetailPage.getId().indexOf("detail") === -1) {
                oSplitContainer.toDetail(
                    this.createId("customer-detail"), "slide", {
                        "id": oData.id
                    }
                );
            } else {
                this._getCustomer(oData.id, function(data) {
                    var oModel = new JSONModel(data); // store the data
                    oCurrentDetailPage.setModel(oModel);
                });
            }
        },

        /**
         * Navigates to the customer-new page.
         *
         * @param oEvent
         */
        onAddCustomer: function(oEvent) {
            var oSplitContainer = this.getView().byId("splitContainer");
            oSplitContainer.toDetail(this.createId("customer-new"), "slide");
        },

        /**
         * Tells the CustomerNew controller to
         * save the new customer.
         *
         * @param oEvent
         */
        onNewCustomerSave: function(oEvent) {
            this.getView().byId("splitContainer").toDetail(
                this.createId("customer-placeholder")
            );
            this.getEvtBus().publish("channelNewCustomer", "saveCustomer");
        },

        /**
         * Gets the customers from the server
         * and creates a JSONModel which is then placed in the view.
         *
         * @param fCallback
         */
        _getCustomers: function(fCallback) {
            new CustomerService().getCustomers(function(res) {
                fCallback(res.data);
            }, function(res) {
                MessageBox.error(this.getResBundle().getText("Misc.error.data.load"));
            });
        },

        /**
         * Gets the customer by id from the server.
         *
         * @param id (customer id)
         * @param fCallback
         */
        _getCustomer: function(id, fCallback) {
            new CustomerService().getCustomer(id,
            function(res) {
                fCallback(res.data);
            },
            function(res) {
                MessageBox.error(this.getResBundle().getText("Misc.error.data.load"));
            });
        }
	});
 });
