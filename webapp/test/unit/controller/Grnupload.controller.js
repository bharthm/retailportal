/*global QUnit*/

sap.ui.define([
	"retailportal/retailportal/controller/Grnupload.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Grnupload Controller");

	QUnit.test("I should test the Grnupload controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
