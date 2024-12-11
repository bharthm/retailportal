sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"

], function (Controller, MessageBox) {
    "use strict";

    return Controller.extend("retailportal.retailportal.controller.OrderDes", {
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
            this.getView().byId("orderDes").setModel(oModel);
            var that = this;
            sap.ui.core.BusyIndicator.show(0);
            this.getOwnerComponent().setModel(oModel, "mainService");
            oModel.read("/YSD_RETAIL_DESSet", {
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
    });
});
