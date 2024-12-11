sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"

], function (Controller, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("retailportal.retailportal.controller.StkRep", {
        onInit: function () {
            debugger;
            this._localModel = this.getOwnerComponent().getModel("mainService");
            this._readData();
        },

        _readData: function () {
            debugger;
            var oModel = this.getOwnerComponent().getModel("mainService");
            oModel.refreshMetadata();
            oModel.refresh(true); // force a data refresh
            this.getView().byId("priceTable").setModel(oModel);
            var that = this;
            sap.ui.core.BusyIndicator.show(0);
            this.getOwnerComponent().setModel(oModel, "mainService");
            oModel.read("/YSD_RETAIL_STK_REPSet", {
                success: function (oData, response) {
                    debugger;
                    sap.ui.core.BusyIndicator.hide();
                    var oJsonModel = new sap.ui.model.json.JSONModel();
                    oJsonModel.setData(oData.results);
                    that.getView().setModel(oJsonModel, "listModel");
                },
                error: function (oErr) {
                    debugger;
                    console.log(oErr);
                    MessageBox.error(JSON.parse(oErr.responseText).error.innererror.errordetails[0].message);
                }
            });
        },
        onWerks: function (oEvent) {
            debugger;
            this._applyFilters();
        },

        onMatnr: function (oEvent) {
            debugger;
            this._applyFilters();
        },

        onMaktx: function (oEvent) {
            debugger;
            this._applyFilters();
        },
        _applyFilters: function () {
            var aFilters = [];
            // Get values from the search fields
            var sMatnr = this.byId("searchFieldMatnr").getValue();
            var sMaktx = this.byId("searchFieldMaktx").getValue();
            var sWerks = this.byId("searchFieldWerks").getValue();

            if (sMatnr) {
                aFilters.push(new Filter("Matnr", FilterOperator.Contains, sMatnr));
            }

            if (sWerks) {
                aFilters.push(new Filter("Werks", FilterOperator.Contains, sWerks));
            }

            if (sMaktx) {
                aFilters.push(new Filter("Maktx", FilterOperator.Contains, sMaktx));
            }

            var oTable = this.byId("priceTable");
            var oBinding = oTable.getBinding("items");

            if (oBinding) {
                if (aFilters.length > 0) {
                    // Ensure filters is an array
                    if (!Array.isArray(aFilters)) {
                        console.error("Filters is not an array:", aFilters);
                        return; // Exit early if filters is not valid
                    }
                    var oCombinedFilter = new Filter({
                        filters: aFilters,
                        and: true
                    });
                    oBinding.filter(oCombinedFilter);
                } else {
                    oBinding.filter([]); // Clear filters
                }
            }
        },
    });
});
