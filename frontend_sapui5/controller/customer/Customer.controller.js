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
    "jquery.sap.global"
], function(BaseController, JSONModel, Filter, FilterOperator, CustomerService, jQuery) {
    "use strict";

 	return BaseController.extend("com.danielwehner.invoicekuga.controller.customer.Customer", {

		/**
		 * onInit function.
         * Loads the customer data (customer list) and registers
         * the navigation event listener
         * which is triggered when a list item is pressed.
		 */
		onInit: function() {

            // load customer list data
            this._getCustomers();

            // get reference to detail page
			var detailPage = this.byId("splitContainer").getDetailPages()[1];

			detailPage.addEventDelegate({

                /**
                 * Loads the customer detail data
                 * and creats a JSONModel before the detail page
                 * is shown.
                 */
				onBeforeShow: function(oEvent) {
                    new CustomerService().getCustomer(oEvent.data.id,
                    function(res) {
                        var oModel = new JSONModel(res.data); // store the data
    					detailPage.setModel(oModel);
                    },
                    function(res) {
                        // add error handling
                    });
				}
			});
		},

		/**
		 * onAfterRendering function.
		 * TODO: This should be done in the view!
		 */
		onAfterRendering: function() {
			var oSplitCont = this.byId("splitContainer");
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
		 * Navigates to the detail page. Before doing so
		 * it is determined which list item was pressed and the
		 * data is passed to the detail view accordingly.
		 *
		 * @param oEvent
		 */
		onListItemPress: function(oEvent) {
            var oCtx = oEvent.getParameters().listItem.getBindingContext();
            var index = oCtx.getPath().substring(1);
            var aModel = oCtx.getModel().getData();

            var oSplitCont = this.byId("splitContainer");
            oSplitCont.toDetail(this.createId("detail-placeholder"), "show");
			oSplitCont.toDetail(
				this.createId("detail"), "slide", {
    				"id": aModel[index].id // data to be transferred to the detail page
    			}
			);
		},
        
        /**
         * Gets the customers from the server
         * and creates a JSONModel which is then placed in the view.
         */
        _getCustomers: function() {
            var oView = this.getView();

            // get customers
            new CustomerService().getCustomers(function(res) {
                var oModel = new JSONModel(res.data);
                oView.setModel(oModel);
            }, function(res) {
                // add error handling
            });
        }
	});
 });
