sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/MessageToast"
],
    function (Controller, ODataModel, MessageToast) {
        "use strict";

        return Controller.extend("retailportal.retailportal.controller.StkUpload", {

            formatDateToISO: function (dateStr) {
                var date = new Date(dateStr);
                var year = date.getFullYear();
                var month = String(date.getMonth() + 1).padStart(2, '0');
                var day = String(date.getDate()).padStart(2, '0');
                var hours = String(date.getHours()).padStart(2, '0');
                var minutes = String(date.getMinutes()).padStart(2, '0');
                var seconds = String(date.getSeconds()).padStart(2, '0');
                return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
            },

            onFileChange: function (oEvent) {
                debugger;
                var aFiles = oEvent.getParameter("files"); // Get the files from the event
                var oButton = this.byId("btnRemove");

                // Check if any files were selected
                if (aFiles && aFiles.length > 0) {
                    oButton.setVisible(true);
                    this._file = aFiles[0]; // Store the selected file for later use
                } else {
                    // No file selected, show a message to the user
                    oButton.setVisible(false);  // Hide if no file is selected
                    MessageToast.show("No file selected.");
                }
            },

            onRemoveFile: function () {
                var oFileUploader = this.byId("fileUploader");
                oFileUploader.clear();  // Clear the selected file
                this.byId("btnRemove").setVisible(false);  // Hide the remove button
                MessageToast.show("File removed.");
            },

            onUploadPress: function () {
                debugger;
                if (!this._file) {
                    MessageToast.show("Please select a file first.");
                    return;
                }

                var reader = new FileReader();
                var that = this;

                reader.onload = function (e) {
                    var data = new Uint8Array(e.target.result);
                    var workbook = XLSX.read(data, { type: 'array' });

                    // Assuming the data is in the first sheet
                    var firstSheetName = workbook.SheetNames[0];
                    var worksheet = workbook.Sheets[firstSheetName];
                    var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                    // Now send jsonData to the OData service
                    that._sendDataToOData(jsonData);
                };
                reader.readAsArrayBuffer(this._file);
            },

            _sendDataToOData: function (data) {
                debugger;
                var oModel = new ODataModel("/sap/opu/odata/sap/YSD_RETAIL_SO_SRV/", {
                    json: true, // Use JSON format
                    useBatch: false, // Enable batch processing
                });

                // Define the field names based on your entity
                var fieldNames = [
                    "Plant",
                    "Material",
                    "Quantity",
                    "Remarks",
                ];

                // Prepare the data to be sent to OData service
                var aPayload = data.map(function (row) {
                    var oRowData = {};
                    // Map row values to field names
                    fieldNames.forEach(function (fieldName, index) {
                        if (row[index] !== undefined && row[index] !== null && row[index] !== "") {
                            // Handle date formatting for Podate
                            oRowData[fieldName] = String(row[index]);
                        }
                    }); // Bind the context
                    return oRowData;
                }); // Bind the context

                // Remove the first row (header)
                aPayload = aPayload.slice(1);

                // Convert to JSON string
                var jsonString = JSON.stringify(aPayload, null, 2); // `null` for replacer, `2` for pretty printing
                var encoded = btoa(encodeURIComponent(jsonString));

                let oEntry = {};

                oEntry.Key = "X";
                oEntry.Value = encoded;
                oModel.create("/YSD_RETAIL_STK_UPDSet", oEntry, {
                    method: "POST",
                    success: function () {
                        debugger;
                        MessageToast.show("Entry uploaded successfully.");
                    },
                    error: function (oError) {
                        console.error("Error uploading entry:", oError);
                        MessageToast.show("Error uploading entry.");
                    }
                });
            }
        });
    });