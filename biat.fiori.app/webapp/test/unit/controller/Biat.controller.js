/*global QUnit*/

sap.ui.define([
	"biat.fiori.app/controller/Biat.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Biat Controller");

	QUnit.test("I should test the Biat controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
